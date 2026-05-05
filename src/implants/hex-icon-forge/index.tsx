import { Button, Field, Panel, Slider, ToggleGroup } from "@core-nexus/components/ui";
import { COORDS, HexIconDefSchema, type PointId } from "@core-nexus/components/ui/icons/HexIcon";
import type { ReactElement } from "react";
import { useState } from "react";

type ShapeMode = "line" | "polygon" | "circle";
type FillValue = "none" | "currentColor";

type Shape = {
  id: string;
  type: ShapeMode;
  pts: PointId[];
  strokeOpacity?: number;
  fill?: FillValue;
  r?: number;
};

const ALL_POINTS = Object.keys(COORDS) as PointId[];

const FILL_OPTIONS: ReadonlyArray<{ value: FillValue; label: string }> = [
  { value: "none", label: "none" },
  { value: "currentColor", label: "currentColor" },
];

const POINT_COLOR = "#7890ae";
const EDGE_COLOR = "#a8bfcf";

function shapeToJsx(s: Shape): ReactElement {
  if (s.type === "line") {
    const pts = s.pts.map((p) => COORDS[p].join(",")).join(" ");
    if (s.pts.length === 2) {
      const [x1, y1] = COORDS[s.pts[0]!];
      const [x2, y2] = COORDS[s.pts[1]!];
      return <line key={s.id} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={s.strokeOpacity} />;
    }
    return <polyline key={s.id} points={pts} fill="none" strokeOpacity={s.strokeOpacity} />;
  }
  if (s.type === "polygon") {
    const pts = s.pts.map((p) => COORDS[p].join(",")).join(" ");
    return <polygon key={s.id} points={pts} fill={s.fill ?? "none"} />;
  }
  const [cx, cy] = COORDS[s.pts[0]!];
  return (
    <circle
      key={s.id}
      cx={cx}
      cy={cy}
      r={s.r ?? 1.5}
      fill={s.fill ?? "none"}
      stroke={s.fill === "currentColor" ? "none" : "currentColor"}
    />
  );
}

function generateJson(shapes: Shape[]): string {
  const def = {
    shapes: shapes.map((s) => {
      if (s.type === "line") {
        const opacity = s.strokeOpacity !== undefined ? { opacity: s.strokeOpacity } : {};
        if (s.pts.length === 2) return { type: "line", pts: [s.pts[0], s.pts[1]], ...opacity };
        return { type: "polyline", pts: [...s.pts], ...opacity };
      }
      if (s.type === "polygon") {
        return {
          type: "polygon",
          pts: [...s.pts],
          ...(s.fill === "currentColor" && { fill: true }),
          ...(s.strokeOpacity !== undefined && { opacity: s.strokeOpacity }),
        };
      }
      return {
        type: "circle",
        center: s.pts[0],
        ...(s.r !== undefined && { r: s.r }),
        ...(s.fill === "currentColor" && { fill: true }),
      };
    }),
  };
  return JSON.stringify(def, null, 2);
}

function loadFromJson(json: string): Shape[] | null {
  try {
    const parsed = HexIconDefSchema.parse(JSON.parse(json));
    return parsed.shapes.map((s) => {
      const id = crypto.randomUUID();
      if (s.type === "line")
        return { id, type: "line" as const, pts: [...s.pts], strokeOpacity: s.opacity };
      if (s.type === "polygon")
        return {
          id,
          type: "polygon" as const,
          pts: [...s.pts],
          fill: s.fill ? "currentColor" : ("none" as FillValue),
          strokeOpacity: s.opacity,
        };
      if (s.type === "polyline")
        return { id, type: "polygon" as const, pts: [...s.pts], fill: "none" as FillValue };
      return {
        id,
        type: "circle" as const,
        pts: [s.center],
        r: s.r,
        fill: s.fill ? "currentColor" : ("none" as FillValue),
      };
    });
  } catch {
    return null;
  }
}

export default function HexIconForge(): ReactElement {
  const [mode, setMode] = useState<ShapeMode | null>(null);
  const [selection, setSelection] = useState<PointId[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [strokeOpacity, setStrokeOpacity] = useState<number | undefined>(undefined);
  const [fill, setFill] = useState<FillValue>("none");
  const [circleR, setCircleR] = useState(1.5);
  const [copiedJson, setCopiedJson] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(false);

  const canCreate =
    (mode === "line" && selection.length >= 2) ||
    (mode === "polygon" && selection.length >= 3) ||
    (mode === "circle" && selection.length === 1);

  function togglePoint(id: PointId) {
    if (!mode) return;
    setSelection((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function changeMode(m: ShapeMode) {
    setMode((prev) => (prev === m ? null : m));
    setSelection([]);
  }

  function createShape() {
    if (!mode || !canCreate) return;
    setShapes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: mode,
        pts: [...selection],
        strokeOpacity: mode !== "circle" ? strokeOpacity : undefined,
        fill: mode !== "line" ? fill : undefined,
        r: mode === "circle" ? circleR : undefined,
      },
    ]);
    setSelection([]);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(generateJson(shapes));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  }

  function importJson() {
    const loaded = loadFromJson(jsonInput);
    if (!loaded) {
      setJsonError(true);
      setTimeout(() => setJsonError(false), 2000);
      return;
    }
    setShapes(loaded);
    setJsonInput("");
  }

  const hintText: Record<ShapeMode, string> = {
    line: `Sélectionner ≥ 2 points (${selection.length} sélectionné${selection.length > 1 ? "s" : ""})`,
    polygon: `Sélectionner ≥ 3 points (${selection.length} sélectionné${selection.length > 1 ? "s" : ""})`,
    circle: `Sélectionner le centre (${selection.length}/1)`,
  };

  return (
    <div className="grid [grid-template-columns:1fr_300px] gap-4 p-4 h-content overflow-hidden">
      <div className="overflow-hidden min-h-0">
        <Panel title="Grille de référence" fill className="h-full">
          <svg
            viewBox="0 0 20 20"
            className="h-full w-auto max-w-full mx-auto block"
            aria-label="Grille hexagonale de référence"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon
              points="10,2.5 16.5,6.25 16.5,13.75 10,17.5 3.5,13.75 3.5,6.25"
              stroke={EDGE_COLOR}
              strokeOpacity="0.2"
              strokeWidth="0.3"
              fill="none"
            />
            <polygon
              points="10,6.25 13.25,8.125 13.25,11.875 10,13.75 6.75,11.875 6.75,8.125"
              stroke={EDGE_COLOR}
              strokeOpacity="0.2"
              strokeWidth="0.25"
              fill="none"
            />
            <line
              x1="16.5"
              y1="10"
              x2="3.5"
              y2="10"
              stroke={EDGE_COLOR}
              strokeOpacity="0.08"
              strokeWidth="0.2"
            />
            <line
              x1="13.25"
              y1="4.375"
              x2="6.75"
              y2="15.625"
              stroke={EDGE_COLOR}
              strokeOpacity="0.08"
              strokeWidth="0.2"
            />
            <line
              x1="13.25"
              y1="15.625"
              x2="6.75"
              y2="4.375"
              stroke={EDGE_COLOR}
              strokeOpacity="0.08"
              strokeWidth="0.2"
            />

            <g stroke="var(--text)" strokeWidth="1.5">
              {shapes.map(shapeToJsx)}
            </g>

            {mode === "line" &&
              selection.length >= 2 &&
              (() => {
                const pts = selection.map((p) => COORDS[p].join(",")).join(" ");
                if (selection.length === 2) {
                  const [x1, y1] = COORDS[selection[0]!];
                  const [x2, y2] = COORDS[selection[1]!];
                  return (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--accent-2)"
                      strokeWidth="1.5"
                      strokeDasharray="0.8 0.4"
                      strokeOpacity="0.7"
                    />
                  );
                }
                return (
                  <polyline
                    points={pts}
                    fill="none"
                    stroke="var(--accent-2)"
                    strokeWidth="1.5"
                    strokeDasharray="0.8 0.4"
                    strokeOpacity="0.7"
                  />
                );
              })()}
            {mode === "polygon" &&
              selection.length >= 3 &&
              (() => {
                const pts = selection.map((p) => COORDS[p].join(",")).join(" ");
                return (
                  <polygon
                    points={pts}
                    stroke="var(--accent-2)"
                    strokeWidth="1.5"
                    strokeDasharray="0.8 0.4"
                    fill="none"
                    strokeOpacity="0.7"
                  />
                );
              })()}
            {mode === "circle" &&
              selection.length === 1 &&
              (() => {
                const [cx, cy] = COORDS[selection[0]!];
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={circleR}
                    stroke="var(--accent-2)"
                    strokeWidth="1.5"
                    strokeDasharray="0.8 0.4"
                    fill="none"
                    strokeOpacity="0.7"
                  />
                );
              })()}

            {ALL_POINTS.map((id) => {
              const [x, y] = COORDS[id];
              const selected = selection.includes(id);
              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: SVG <g> sans alternative sémantique
                <g
                  key={id}
                  tabIndex={mode ? 0 : -1}
                  onClick={() => togglePoint(id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") togglePoint(id);
                  }}
                  style={{ cursor: mode ? "pointer" : "default" }}
                >
                  <circle cx={x} cy={y} r="1.4" fill="transparent" />
                  <circle
                    cx={x}
                    cy={y}
                    r={selected ? 0.85 : 0.35}
                    fill={POINT_COLOR}
                    fillOpacity={selected ? 1 : 0.5}
                    stroke={selected ? "white" : "none"}
                    strokeWidth="0.2"
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--bg)"
                    fontSize="0.25"
                    fontFamily="monospace"
                    fontWeight={"bold"}
                  >
                    {id}
                  </text>
                </g>
              );
            })}
          </svg>
          {mode && (
            <p className="mt-[0.6rem] font-mono text-[0.58rem] tracking-[0.1em] uppercase text-accent-2">
              {hintText[mode]}
            </p>
          )}
        </Panel>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto">
        <Panel title="Contrôles">
          <div className="flex flex-col gap-[0.75rem]">
            <Field label="Mode">
              <div className="flex gap-[0.4rem] flex-wrap">
                {(["line", "polygon", "circle"] as ShapeMode[]).map((m) => (
                  <Button
                    key={m}
                    size="sm"
                    variant={mode === m ? "primary" : "default"}
                    onClick={() => changeMode(m)}
                  >
                    {m === "line" ? "Ligne" : m === "polygon" ? "Polygone" : "Cercle"}
                  </Button>
                ))}
              </div>
            </Field>

            {mode && mode !== "circle" && (
              <Field label="Opacité du trait">
                <Slider
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={strokeOpacity ?? 1}
                  onChange={setStrokeOpacity}
                  onClear={
                    strokeOpacity !== undefined ? () => setStrokeOpacity(undefined) : undefined
                  }
                  display={strokeOpacity ?? "—"}
                />
              </Field>
            )}

            {mode === "circle" && (
              <Field label="Rayon">
                <Slider min={0.3} max={7} step={0.05} value={circleR} onChange={setCircleR} />
              </Field>
            )}

            {mode && mode !== "line" && (
              <Field label="Fill">
                <ToggleGroup options={FILL_OPTIONS} value={fill} onChange={setFill} />
              </Field>
            )}

            <Button variant="primary" disabled={!canCreate} onClick={createShape}>
              + Ajouter la forme
            </Button>
          </div>
        </Panel>

        <Panel title={`Formes (${shapes.length})`}>
          {shapes.length === 0 ? (
            <p className="font-mono text-[0.6rem] text-text-faint m-0">Aucune forme.</p>
          ) : (
            <ul className="list-none p-0 m-0 flex flex-col gap-[0.3rem]">
              {shapes.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-[0.5rem] px-[0.5rem] py-[0.3rem] bg-bg border border-border"
                >
                  <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.06em] overflow-hidden text-ellipsis whitespace-nowrap">
                    {s.type} · {s.pts.join(" → ")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShapes((prev) => prev.filter((x) => x.id !== s.id))}
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Aperçu">
          <div className="flex items-end gap-4 mb-[0.75rem]">
            {[16, 24, 48, 96].map((size) => (
              <div key={size} className="flex flex-col items-center gap-[0.4rem]">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width={size}
                  height={size}
                  style={{ color: "var(--text)" }}
                >
                  {shapes.map(shapeToJsx)}
                </svg>
                <span className="font-mono text-[0.48rem] text-text-faint">{size}px</span>
              </div>
            ))}
          </div>
          <Button variant="primary" disabled={shapes.length === 0} onClick={copyJson}>
            {copiedJson ? "✓ Copié !" : "Copier JSON"}
          </Button>
        </Panel>

        <Panel title="Importer JSON">
          <div className="flex flex-col gap-[0.5rem]">
            <textarea
              className="w-full h-[6rem] bg-bg border border-border font-mono text-[0.55rem] text-text p-[0.5rem] resize-none outline-none focus:border-accent"
              placeholder='{ "shapes": [...] }'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <Button
              variant={jsonError ? "default" : "default"}
              disabled={!jsonInput.trim()}
              onClick={importJson}
            >
              {jsonError ? "JSON invalide" : "Charger"}
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
