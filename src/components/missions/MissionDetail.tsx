import type { Epic } from "@core-nexus/types/mission";
import type { CSSProperties } from "react";
import { useState } from "react";
import type { SelectedMission } from "./GalacticMap";

export type DetailTarget = ({ kind: "mission" } & SelectedMission) | { kind: "epic"; epic: Epic };

interface Props {
  target: DetailTarget;
  onClose: () => void;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
}

export function MissionDetail({ target, onClose, onTagAdd, onTagRemove }: Props) {
  const [newTag, setNewTag] = useState("");
  const epicColor = target.kind === "mission" ? target.epicColor : target.epic.color;
  const currentTags = target.kind === "mission" ? target.mission.tags : target.epic.tags;

  function commitTag() {
    const tag = newTag.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag || currentTags.includes(tag)) {
      setNewTag("");
      return;
    }
    onTagAdd?.(tag);
    setNewTag("");
  }

  return (
    <div
      className="relative bg-surface border [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,14px_100%,0_calc(100%-14px))] p-[0.9rem_1rem] flex flex-col gap-[0.55rem] [animation:panel-in_0.2s_ease_both] flex-1 min-h-0 overflow-y-auto"
      style={
        {
          "--epic-color": epicColor,
          borderColor: "var(--epic-color, var(--border-hi))",
        } as CSSProperties
      }
    >
      <div
        className="absolute top-0 right-0 w-[26px] h-[26px] [clip-path:polygon(100%_0,100%_100%,0_0)] pointer-events-none"
        style={{ background: "var(--epic-color, var(--border-hi))" }}
      />

      <div className="flex items-center gap-[0.4rem]">
        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-text-faint bg-surface-2 border border-border px-[5px] py-[1px] [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))]">
          {target.kind === "mission" ? target.mission.source.toUpperCase() : "FRONT"}
        </span>
        {target.kind === "mission" && target.mission.sourceRef && (
          <span className="font-mono text-[0.55rem] text-text-faint tracking-[0.08em] flex-1">
            {target.mission.sourceRef}
          </span>
        )}
        <button
          type="button"
          className="ml-auto bg-transparent border-0 text-text-faint text-[0.6rem] cursor-pointer px-[4px] py-[2px] leading-none transition-colors duration-150 hover:text-text"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      <div className="font-display text-[0.75rem] font-bold text-text tracking-[0.08em] leading-[1.3]">
        {target.kind === "mission" ? target.mission.title : target.epic.title}
      </div>

      {target.kind === "mission" ? (
        <>
          <div className="flex items-center gap-[0.4rem]">
            <span
              className="w-[6px] h-[6px] rounded-[1px] [transform:rotate(45deg)] shrink-0"
              style={{ background: epicColor }}
            />
            <span className="font-mono text-[0.58rem] text-text-dim tracking-[0.06em]">
              {target.epicTitle}
            </span>
          </div>

          {target.mission.description && (
            <p
              className="font-mono text-[0.6rem] text-text-dim leading-[1.55] m-0 border-l-2 pl-[0.5rem]"
              style={{ borderLeftColor: "var(--epic-color, var(--border))" }}
            >
              {target.mission.description}
            </p>
          )}

          <div className="flex flex-col gap-[0.15rem]">
            <span className="font-mono text-[0.5rem] text-text-faint tracking-[0.15em]">ÉTAT</span>
            <span
              className="font-mono text-[0.6rem] tracking-[0.1em] font-semibold"
              style={{ color: epicColor }}
            >
              {target.stateLabel.toUpperCase()}
            </span>
          </div>

          {target.mission.assignees.length > 0 && (
            <div className="flex flex-col gap-[0.3rem]">
              <span className="font-mono text-[0.5rem] text-text-faint tracking-[0.15em]">
                ASSIGNÉS
              </span>
              <div className="flex flex-wrap gap-[0.3rem]">
                {target.mission.assignees.map((a) => (
                  <span
                    key={a}
                    className="font-mono text-[0.55rem] text-text-dim bg-surface-2 border border-border-hi px-[6px] py-[1px] tracking-[0.06em] [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-[0.35rem] pt-[0.2rem] border-t border-border">
            <span className="font-mono text-[0.5rem] text-text-faint tracking-[0.15em]">TAGS</span>
            {target.mission.tags.length > 0 && (
              <div className="flex flex-wrap gap-[0.3rem]">
                {target.mission.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-[1px] font-mono text-[0.5rem] text-text-faint tracking-[0.06em] bg-surface-2 border border-border px-[4px] py-[1px] pl-[3px] [clip-path:polygon(0_0,calc(100%-3px)_0,100%_3px,100%_100%,3px_100%,0_calc(100%-3px))]"
                  >
                    <span className="opacity-40 mr-[1px]">#</span>
                    {t}
                    <button
                      type="button"
                      className="bg-transparent border-0 text-text-faint text-[0.6rem] leading-none cursor-pointer pl-[3px] py-0 opacity-50 transition-[opacity,color] duration-[120ms] hover:opacity-100 hover:text-error"
                      onClick={() => onTagRemove?.(t)}
                      aria-label={`Supprimer le tag ${t}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-[0.3rem] items-center">
              <input
                type="text"
                className="flex-1 bg-surface-2 border border-border text-text-dim font-mono text-[0.55rem] tracking-[0.06em] px-[6px] py-[3px] outline-none [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))] transition-[border-color] duration-150 placeholder:text-text-faint placeholder:opacity-60 focus:[border-color:var(--epic-color,var(--accent))]"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitTag();
                  }
                }}
                placeholder="Nouveau tag…"
                maxLength={32}
              />
              <button
                type="button"
                className="bg-transparent border border-border text-text-dim text-[0.9rem] leading-none cursor-pointer px-[7px] py-[2px] [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))] transition-[border-color,color] duration-150 hover:[border-color:var(--epic-color,var(--accent))] hover:text-text"
                onClick={commitTag}
              >
                +
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {target.epic.description && (
            <p
              className="font-mono text-[0.6rem] text-text-dim leading-[1.55] m-0 border-l-2 pl-[0.5rem]"
              style={{ borderLeftColor: "var(--epic-color, var(--border))" }}
            >
              {target.epic.description}
            </p>
          )}

          <div className="flex flex-col gap-[0.15rem]">
            <span className="font-mono text-[0.5rem] text-text-faint tracking-[0.15em]">
              DIRECTIVES ACTIVES
            </span>
            <span
              className="font-mono text-[0.6rem] tracking-[0.1em] font-semibold"
              style={{ color: epicColor }}
            >
              {target.epic.missions.filter((m) => !m.integrated).length}
            </span>
          </div>

          <div className="flex flex-col gap-[0.15rem]">
            <span className="font-mono text-[0.5rem] text-text-faint tracking-[0.15em]">
              INTÉGRÉES AU NEXUS
            </span>
            <span
              className="font-mono text-[0.6rem] tracking-[0.1em] font-semibold"
              style={{ color: "var(--connected, #00e5a0)" }}
            >
              {target.epic.missions.filter((m) => m.integrated).length}
            </span>
          </div>

          <div className="flex flex-col gap-[0.35rem] pt-[0.2rem] border-t border-border">
            <span className="font-mono text-[0.5rem] text-text-faint tracking-[0.15em]">ÉTATS</span>
            <div className="flex flex-col gap-[0.2rem] mt-[0.2rem]">
              {target.epic.states.map((state) => {
                const count = target.epic.missions.filter(
                  (m) => m.stateId === state.id && !m.integrated,
                ).length;
                return (
                  <div
                    key={state.id}
                    className="flex items-center justify-between gap-[0.5rem] px-[0.4rem] py-[0.2rem] bg-surface-2 border-l-2 [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,0_100%)]"
                    style={{ borderLeftColor: "var(--epic-color, var(--border))" }}
                  >
                    <span className="font-mono text-[0.5rem] tracking-[0.12em] text-text-dim">
                      {state.label.toUpperCase()}
                    </span>
                    <span
                      className="font-display text-[0.65rem] font-bold leading-none"
                      style={{ color: epicColor }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-[0.35rem] pt-[0.2rem] border-t border-border">
            <span className="font-mono text-[0.5rem] text-text-faint tracking-[0.15em]">TAGS</span>
            {target.epic.tags.length > 0 && (
              <div className="flex flex-wrap gap-[0.3rem]">
                {target.epic.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-[1px] font-mono text-[0.5rem] text-text-faint tracking-[0.06em] bg-surface-2 border border-border px-[4px] py-[1px] pl-[3px] [clip-path:polygon(0_0,calc(100%-3px)_0,100%_3px,100%_100%,3px_100%,0_calc(100%-3px))]"
                  >
                    <span className="opacity-40 mr-[1px]">#</span>
                    {t}
                    <button
                      type="button"
                      className="bg-transparent border-0 text-text-faint text-[0.6rem] leading-none cursor-pointer pl-[3px] py-0 opacity-50 transition-[opacity,color] duration-[120ms] hover:opacity-100 hover:text-error"
                      onClick={() => onTagRemove?.(t)}
                      aria-label={`Supprimer le tag ${t}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-[0.3rem] items-center">
              <input
                type="text"
                className="flex-1 bg-surface-2 border border-border text-text-dim font-mono text-[0.55rem] tracking-[0.06em] px-[6px] py-[3px] outline-none [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))] transition-[border-color] duration-150 placeholder:text-text-faint placeholder:opacity-60 focus:[border-color:var(--epic-color,var(--accent))]"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitTag();
                  }
                }}
                placeholder="Nouveau tag…"
                maxLength={32}
              />
              <button
                type="button"
                className="bg-transparent border border-border text-text-dim text-[0.9rem] leading-none cursor-pointer px-[7px] py-[2px] [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))] transition-[border-color,color] duration-150 hover:[border-color:var(--epic-color,var(--accent))] hover:text-text"
                onClick={commitTag}
              >
                +
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
