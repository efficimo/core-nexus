import type { Epic, Mission } from "@core-nexus/types/mission";
import { useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Constantes géométriques
// ---------------------------------------------------------------------------

const CX = 400;
const CY = 380;
const INNER_R = 68;
const OUTER_R = 310;
const TILT = Math.cos((38 * Math.PI) / 180); // ~0.788

const VB_X = 0;
const VB_Y = 60;
const VB_W = 800;
const VB_H = 680;

const TAU = 2 * Math.PI;
const START_ANGLE = Math.PI / 2;

const PIN_SIZE = 6;

// ---------------------------------------------------------------------------
// Géométrie SVG
// ---------------------------------------------------------------------------

function toXY(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) * TILT };
}

function toCSS(svgX: number, svgY: number) {
  return { left: `${((svgX - VB_X) / VB_W) * 100}%`, top: `${((svgY - VB_Y) / VB_H) * 100}%` };
}

function arcPath(r1: number, r2: number, a1: number, a2: number): string {
  const large = a2 - a1 > Math.PI ? 1 : 0;
  const [o1, o2, i1, i2] = [toXY(a1, r2), toXY(a2, r2), toXY(a1, r1), toXY(a2, r1)];
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${r2} ${r2 * TILT} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${r1} ${r1 * TILT} 0 ${large} 0 ${i1.x} ${i1.y}`,
    "Z",
  ].join(" ");
}

function arcOnlyPath(r: number, a1: number, a2: number): string {
  const large = a2 - a1 > Math.PI ? 1 : 0;
  const [p1, p2] = [toXY(a1, r), toXY(a2, r)];
  return `M ${p1.x} ${p1.y} A ${r} ${r * TILT} 0 ${large} 1 ${p2.x} ${p2.y}`;
}

function radialLine(a: number, r1: number, r2: number): string {
  const [p1, p2] = [toXY(a, r1), toXY(a, r2)];
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
}

function clientToSVG(svg: SVGSVGElement, cx: number, cy: number) {
  const pt = svg.createSVGPoint();
  pt.x = cx;
  pt.y = cy;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}

function distToCenter(svgX: number, svgY: number): number {
  const dx = svgX - CX;
  const dy = (svgY - CY) / TILT;
  return Math.sqrt(dx * dx + dy * dy);
}

// ---------------------------------------------------------------------------
// Hit-test : coordonnées SVG → épic + état
// ---------------------------------------------------------------------------

interface DropTarget {
  epic: Epic;
  stateId: string;
  stateIndex: number;
  a1: number;
  a2: number;
}

function hitTest(
  svgX: number,
  svgY: number,
  epics: Epic[],
  frontStart: number,
  epicAngle: number,
): DropTarget | null {
  const r = distToCenter(svgX, svgY);
  if (r < INNER_R || r > OUTER_R) return null;

  const dx = svgX - CX;
  const dy = (svgY - CY) / TILT;
  let angle = Math.atan2(dy, dx);
  while (angle < frontStart) angle += TAU;
  while (angle >= frontStart + TAU) angle -= TAU;

  const i = Math.floor((angle - frontStart) / epicAngle);
  const epic = epics[i % epics.length];
  if (!epic) return null;

  const N = epic.states.length;
  const band = (OUTER_R - INNER_R) / N;
  const si = Math.min(N - 1, Math.max(0, Math.floor((OUTER_R - r) / band)));
  const state = epic.states[si];
  if (!state) return null;

  return {
    epic,
    stateId: state.id,
    stateIndex: si,
    a1: frontStart + i * epicAngle,
    a2: frontStart + (i + 1) * epicAngle,
  };
}

// ---------------------------------------------------------------------------
// Pins : filtre les missions intégrées
// ---------------------------------------------------------------------------

interface PinData {
  mission: Mission;
  x: number;
  y: number;
}
interface OverflowBadge {
  x: number;
  y: number;
  count: number;
}

// Seuil par anneau : N - si + 2 (anneau le plus près du centre → 3, puis 4, 5…)
function computePins(
  epic: Epic,
  a1: number,
  a2: number,
): { pins: PinData[]; overflows: OverflowBadge[] } {
  const N = epic.states.length;
  const band = (OUTER_R - INNER_R) / N;
  const byState = new Map<number, Mission[]>();

  for (const m of epic.missions) {
    if (m.integrated) continue;
    const si = epic.states.findIndex((s) => s.id === m.stateId);
    if (si === -1) continue;
    if (!byState.has(si)) byState.set(si, []);
    byState.get(si)!.push(m);
  }

  const pins: PinData[] = [];
  const overflows: OverflowBadge[] = [];

  for (const [si, missions] of byState) {
    const maxVisible = N - si + 2;
    const pinR = OUTER_R - (si + 0.5) * band;
    const span = a2 - a1;
    const margin = span * 0.1;
    const usable = span - 2 * margin;

    if (missions.length <= maxVisible) {
      for (let j = 0; j < missions.length; j++) {
        const m = missions[j];
        if (!m) continue;
        const angle = a1 + margin + ((j + 0.5) * usable) / missions.length;
        pins.push({ mission: m, ...toXY(angle, pinR) });
      }
    } else {
      // Réserve le dernier slot pour le badge
      const showCount = maxVisible - 1;
      for (let j = 0; j < showCount; j++) {
        const m = missions[j];
        if (!m) continue;
        const angle = a1 + margin + ((j + 0.5) * usable) / maxVisible;
        pins.push({ mission: m, ...toXY(angle, pinR) });
      }
      const badgeAngle = a1 + margin + ((showCount + 0.5) * usable) / maxVisible;
      overflows.push({ ...toXY(badgeAngle, pinR), count: missions.length - showCount });
    }
  }

  return { pins, overflows };
}

// ---------------------------------------------------------------------------
// Types locaux UI
// ---------------------------------------------------------------------------

export interface SelectedMission {
  mission: Mission;
  epicTitle: string;
  epicColor: string;
  stateLabel: string;
}
interface DragState {
  missionId: string;
  epicId: string;
  svgX: number;
  svgY: number;
  startSvgX: number;
  startSvgY: number;
  hasMoved: boolean;
  info: SelectedMission;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  epics: Epic[];
  onMissionUpdate: (
    epicId: string,
    missionId: string,
    patch: Partial<Pick<Mission, "stateId" | "integrated">>,
  ) => void;
  selectedMissionId?: string;
  hoveredEpicId?: string | null;
  onMissionClick?: (m: SelectedMission) => void;
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function GalacticMap({
  epics,
  onMissionUpdate,
  selectedMissionId,
  hoveredEpicId,
  onMissionClick,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const [drag, setDrag] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [overCenter, setOverCenter] = useState(false);

  const epicAngle = TAU / Math.max(epics.length, 1);
  const frontStart = START_ANGLE;

  // Compteurs d'intégrées positionnés sur le bord intérieur de chaque secteur
  const integratedCounters = epics
    .map((epic, idx) => {
      const count = epic.missions.filter((m) => m.integrated).length;
      if (count === 0) return null;
      const mid = frontStart + (idx + 0.5) * epicAngle;
      return { epic, count, css: toCSS(toXY(mid, INNER_R).x, toXY(mid, INNER_R).y) };
    })
    .filter(Boolean) as Array<{ epic: Epic; count: number; css: { left: string; top: string } }>;

  // --- Drag & Drop ---
  function handlePinPointerDown(
    e: React.PointerEvent,
    epic: Epic,
    pin: { mission: Mission; x: number; y: number },
  ) {
    if (!svgRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    svgRef.current.setPointerCapture(e.pointerId);
    const svgPt = clientToSVG(svgRef.current, e.clientX, e.clientY);
    const si = epic.states.findIndex((s) => s.id === pin.mission.stateId);
    const info: SelectedMission = {
      mission: pin.mission,
      epicTitle: epic.title,
      epicColor: epic.color,
      stateLabel: epic.states[si]?.label ?? pin.mission.stateId,
    };
    setDrag({
      missionId: pin.mission.id,
      epicId: epic.id,
      svgX: svgPt.x,
      svgY: svgPt.y,
      startSvgX: svgPt.x,
      startSvgY: svgPt.y,
      hasMoved: false,
      info,
    });
  }

  function handleSVGPointerMove(e: React.PointerEvent) {
    if (!drag || !svgRef.current) return;
    const svgPt = clientToSVG(svgRef.current, e.clientX, e.clientY);
    const dx = svgPt.x - drag.startSvgX;
    const dy = svgPt.y - drag.startSvgY;
    const isMoving = drag.hasMoved || dx * dx + dy * dy > 64;
    setDrag((d) => d && { ...d, svgX: svgPt.x, svgY: svgPt.y, hasMoved: isMoving });
    if (!isMoving) return;
    if (distToCenter(svgPt.x, svgPt.y) < INNER_R) {
      setOverCenter(true);
      setDropTarget(null);
    } else {
      setOverCenter(false);
      const target = hitTest(svgPt.x, svgPt.y, epics, frontStart, epicAngle);
      setDropTarget(target?.epic.id === drag.epicId ? target : null);
    }
  }

  function handleSVGPointerUp() {
    if (drag) {
      if (!drag.hasMoved) {
        onMissionClick?.(drag.info);
      } else if (overCenter) {
        onMissionUpdate(drag.epicId, drag.missionId, { integrated: true });
      } else if (dropTarget) {
        onMissionUpdate(drag.epicId, drag.missionId, { stateId: dropTarget.stateId });
      }
    }
    setDrag(null);
    setDropTarget(null);
    setOverCenter(false);
  }

  const coreLabelCSS = toCSS(CX, CY);
  const isHot = overCenter && !!drag;

  return (
    <div className="relative h-full w-fit">
      <svg
        ref={svgRef}
        viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
        className={`block h-full w-auto touch-none select-none${drag ? " cursor-grabbing" : ""}`}
        aria-label="Carte galactique des missions"
        onPointerMove={handleSVGPointerMove}
        onPointerUp={handleSVGPointerUp}
      >
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="#2e6aff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#1a3a8a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#07090d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="coreGlowHot">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#2e6aff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#07090d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bgGlow">
            <stop offset="0%" stopColor="#0e1828" stopOpacity="1" />
            <stop offset="100%" stopColor="#07090d" stopOpacity="1" />
          </radialGradient>
          <filter id="pinGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="coreF" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dragPin" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fond */}
        <ellipse cx={CX} cy={CY} rx={OUTER_R + 1} ry={(OUTER_R + 1) * TILT} fill="url(#bgGlow)" />

        {/* Secteurs */}
        {epics.map((epic, idx) => {
          const a1 = frontStart + idx * epicAngle;
          const a2 = a1 + epicAngle;
          const N = epic.states.length;
          const band = (OUTER_R - INNER_R) / N;
          const { pins, overflows } = computePins(epic, a1, a2);
          const isHovered = hoveredEpicId === epic.id;

          return (
            <g key={epic.id}>
              <path
                d={arcPath(INNER_R, OUTER_R, a1, a2)}
                fill={epic.color}
                fillOpacity={isHovered ? 0.18 : 0.08}
                stroke={epic.color}
                strokeWidth="1"
                strokeOpacity={isHovered ? 0.7 : 0.45}
              />
              {Array.from({ length: N - 1 }, (_, i) => (
                <path
                  // biome-ignore lint/suspicious/noArrayIndexKey: arcs sans identifiant stable
                  key={i}
                  d={arcOnlyPath(OUTER_R - (i + 1) * band, a1 + 0.015, a2 - 0.015)}
                  fill="none"
                  stroke={epic.color}
                  strokeWidth="0.8"
                  strokeOpacity="0.22"
                  strokeDasharray="4 7"
                />
              ))}
              <path
                d={radialLine(a1, INNER_R, OUTER_R)}
                stroke={epic.color}
                strokeWidth="0.6"
                strokeOpacity="0.3"
              />
              <path
                d={radialLine(a2, INNER_R, OUTER_R)}
                stroke={epic.color}
                strokeWidth="0.6"
                strokeOpacity="0.3"
              />
              <path
                d={arcOnlyPath(OUTER_R, a1, a2)}
                fill="none"
                stroke={epic.color}
                strokeWidth={isHovered ? 4 : 2.5}
                strokeOpacity={isHovered ? 1 : 0.65}
              />

              {overflows.map((ov, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positions sans identifiant stable
                <g key={`ov-${i}`} transform={`translate(${ov.x}, ${ov.y})`} pointerEvents="none">
                  <circle
                    r={PIN_SIZE * 1.8}
                    fill={epic.color}
                    fillOpacity="0.15"
                    stroke={epic.color}
                    strokeWidth="1"
                    strokeOpacity="0.85"
                    strokeDasharray="2 2"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={epic.color}
                    style={{ fontFamily: "var(--font-mono)", fontSize: "5.5px", fontWeight: 700 }}
                  >
                    +{ov.count}
                  </text>
                </g>
              ))}

              {pins.map((pin) => {
                const isDragged = drag?.missionId === pin.mission.id;
                const isSelected = selectedMissionId === pin.mission.id;

                return (
                  <g key={pin.mission.id} transform={`translate(${pin.x}, ${pin.y})`}>
                    {isSelected && (
                      <circle
                        r={PIN_SIZE * 2.8}
                        fill="none"
                        stroke="white"
                        strokeWidth="0.9"
                        strokeOpacity="0.6"
                        strokeDasharray="3 4"
                        className="animate-sel-pulse"
                      />
                    )}
                    <g
                      className={`cursor-grab transition-transform duration-[120ms] ease [transform-origin:0px_0px] hover:scale-150${isDragged ? " opacity-25 pointer-events-none" : ""}`}
                      onPointerDown={(e) => handlePinPointerDown(e, epic, pin)}
                      filter="url(#pinGlow)"
                    >
                      <circle r={PIN_SIZE * 1.8} fill={epic.color} fillOpacity="0.1" />
                      <polygon
                        points={`0,${-PIN_SIZE} ${PIN_SIZE},0 0,${PIN_SIZE} ${-PIN_SIZE},0`}
                        fill={epic.color}
                        fillOpacity={isSelected ? "1" : "0.9"}
                        stroke={epic.color}
                        strokeWidth={isSelected ? "1.2" : "0.7"}
                      />
                      <circle r={PIN_SIZE * 0.28} fill="white" fillOpacity="0.95" />
                    </g>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Highlight de drop sur un anneau */}
        {drag &&
          dropTarget &&
          (() => {
            const { stateIndex, a1, a2, epic } = dropTarget;
            const band = (OUTER_R - INNER_R) / epic.states.length;
            const r1 = OUTER_R - (stateIndex + 1) * band;
            const r2 = OUTER_R - stateIndex * band;
            return (
              <path
                d={arcPath(r1, r2, a1, a2)}
                fill="white"
                fillOpacity="0.1"
                stroke="white"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                pointerEvents="none"
                className="animate-drop-pulse"
              />
            );
          })()}

        {/* Pin en cours de drag */}
        {drag && (
          <g
            transform={`translate(${drag.svgX}, ${drag.svgY})`}
            pointerEvents="none"
            filter="url(#dragPin)"
            className="animate-drag-float"
          >
            <circle r={18} fill="white" fillOpacity="0.06" />
            <polygon
              points="0,-9 9,0 0,9 -9,0"
              fill="white"
              fillOpacity="0.9"
              stroke="white"
              strokeWidth="1"
            />
            <circle r={2.5} fill="var(--accent)" fillOpacity="0.95" />
          </g>
        )}

        {/* Core Nexus */}
        <ellipse
          cx={CX}
          cy={CY}
          rx={INNER_R + 14}
          ry={(INNER_R + 14) * TILT}
          fill={overCenter ? "url(#coreGlowHot)" : "url(#coreGlow)"}
          filter="url(#coreF)"
        />
        <ellipse
          cx={CX}
          cy={CY}
          rx={INNER_R}
          ry={INNER_R * TILT}
          fill="#07090d"
          stroke={overCenter ? "white" : "#2e6aff"}
          strokeWidth={overCenter ? "2" : "1.5"}
          strokeDasharray="6 4"
          strokeOpacity={overCenter ? "0.7" : "1"}
        />
        <ellipse
          cx={CX}
          cy={CY}
          rx={INNER_R - 14}
          ry={(INNER_R - 14) * TILT}
          fill="none"
          stroke="#2e6aff"
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />
      </svg>

      {/* Overlay HTML */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Label Core */}
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col items-center gap-1 pointer-events-none transition-opacity duration-200"
          style={coreLabelCSS}
        >
          <span
            className={`font-display text-[0.5rem] font-bold tracking-[0.25em] transition-[color,text-shadow] duration-200${isHot ? " [text-shadow:0_0_10px_rgba(255,255,255,0.8)]" : ""}`}
            style={{ color: isHot ? "white" : "var(--text-dim)" }}
          >
            CORE
          </span>
        </div>

        {/* Compteurs d'intégrées — un badge par épic, sur le bord intérieur de son secteur */}
        {integratedCounters.map(({ epic, count, css }) => (
          <span
            key={epic.id}
            className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center gap-[2px] font-mono text-[0.48rem] font-semibold tracking-[0.06em] px-[4px] py-[1px] bg-[rgba(7,9,13,0.85)] border [clip-path:polygon(0_0,calc(100%-3px)_0,100%_3px,100%_100%,3px_100%,0_calc(100%-3px))]"
            style={{ ...css, color: epic.color, borderColor: `${epic.color}55` }}
          >
            <span className="text-[0.4rem] leading-none">◆</span>
            {count}
          </span>
        ))}
      </div>
    </div>
  );
}
