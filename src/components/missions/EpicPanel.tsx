import type { Epic } from "@core-nexus/types/mission";
import type { CSSProperties } from "react";
import { EPICS_PAGE_SIZE } from "./config";

interface Props {
  epics: Epic[];
  startIndex: number;
  onStartIndexChange: (idx: number) => void;
  hoveredEpicId: string | null;
  onHover: (id: string | null) => void;
  selectedEpicId: string | null;
  onSelect: (epic: Epic | null) => void;
}

export function EpicPanel({
  epics,
  startIndex,
  onStartIndexChange,
  hoveredEpicId,
  onHover,
  selectedEpicId,
  onSelect,
}: Props) {
  const hasPagination = epics.length > EPICS_PAGE_SIZE;
  const displayed = hasPagination ? epics.slice(startIndex, startIndex + EPICS_PAGE_SIZE) : epics;
  const nextCount = Math.max(0, epics.length - startIndex - EPICS_PAGE_SIZE);

  return (
    <div className="relative bg-surface border border-border-hi [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,14px_100%,0_calc(100%-14px))] p-[0.8rem_0.9rem] flex flex-col gap-[0.35rem]">
      <div className="absolute top-0 right-0 w-[26px] h-[26px] bg-border-hi [clip-path:polygon(100%_0,100%_100%,0_0)] pointer-events-none" />

      <div className="flex items-center justify-between pb-[0.4rem] border-b border-border mb-[0.05rem]">
        <span className="font-mono text-[0.48rem] tracking-[0.2em] text-text-faint">
          FRONTS DE CAMPAGNE
        </span>
        <span className="font-display text-[0.75rem] font-bold text-accent leading-none">
          {epics.length}
        </span>
      </div>

      {hasPagination &&
        (startIndex > 0 ? (
          <button
            type="button"
            className="group flex items-center gap-[0.4rem] bg-surface-2 border border-border px-[0.5rem] py-[0.28rem] cursor-pointer [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))] transition-[border-color,background] duration-150 w-full hover:bg-[rgba(46,106,255,0.08)] hover:border-[rgba(46,106,255,0.45)]"
            onClick={() => onStartIndexChange(Math.max(0, startIndex - EPICS_PAGE_SIZE))}
          >
            <span className="font-mono text-[0.5rem] text-text-faint leading-none shrink-0 transition-colors duration-150 group-hover:text-accent">
              ▲
            </span>
            <span className="font-mono text-[0.44rem] tracking-[0.1em] text-text-faint flex-1 text-center whitespace-nowrap">
              {startIndex} FRONT{startIndex > 1 ? "S" : ""} ANTÉRIEUR{startIndex > 1 ? "S" : ""}
            </span>
          </button>
        ) : (
          <div className="h-[1.55rem]" />
        ))}

      <div className="flex flex-col gap-[0.1rem]">
        {displayed.map((epic) => {
          const active = epic.missions.filter((m) => !m.integrated).length;
          const isActive = hoveredEpicId === epic.id || selectedEpicId === epic.id;
          const isSel = selectedEpicId === epic.id;
          return (
            <button
              key={epic.id}
              type="button"
              className="flex items-start gap-[0.45rem] px-[0.45rem] py-[0.3rem] bg-transparent border border-transparent cursor-pointer text-left transition-[background,border-color] duration-150 [clip-path:polygon(0_0,calc(100%-5px)_0,100%_5px,100%_100%,5px_100%,0_calc(100%-5px))] w-full"
              style={
                {
                  "--epic-color": epic.color,
                  ...(isSel
                    ? {
                        background: "color-mix(in srgb, var(--epic-color) 16%, transparent)",
                        borderColor: "color-mix(in srgb, var(--epic-color) 55%, transparent)",
                      }
                    : isActive
                      ? {
                          background: "color-mix(in srgb, var(--epic-color) 10%, transparent)",
                          borderColor: "color-mix(in srgb, var(--epic-color) 30%, transparent)",
                        }
                      : {}),
                } as CSSProperties
              }
              onMouseEnter={() => onHover(epic.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(isSel ? null : epic)}
            >
              <span
                className="w-[6px] h-[6px] rounded-[1px] [transform:rotate(45deg)] shrink-0 mt-[0.2rem]"
                style={{ background: epic.color }}
              />
              <span className="font-display text-[0.55rem] font-bold tracking-[0.1em] text-text leading-[1.4] flex-1 line-clamp-2 text-left">
                {epic.title}
              </span>
              {active > 0 && (
                <span
                  className="font-mono text-[0.48rem] tracking-[0.04em] font-semibold shrink-0 opacity-80 mt-[0.15rem]"
                  style={{ color: epic.color }}
                >
                  {active}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {hasPagination &&
        (nextCount > 0 ? (
          <button
            type="button"
            className="group flex items-center gap-[0.4rem] bg-surface-2 border border-border px-[0.5rem] py-[0.28rem] cursor-pointer [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))] transition-[border-color,background] duration-150 w-full hover:bg-[rgba(46,106,255,0.08)] hover:border-[rgba(46,106,255,0.45)]"
            onClick={() => onStartIndexChange(startIndex + EPICS_PAGE_SIZE)}
          >
            <span className="font-mono text-[0.44rem] tracking-[0.1em] text-text-faint flex-1 text-center whitespace-nowrap">
              {nextCount} FRONT{nextCount > 1 ? "S" : ""} SUIVANT{nextCount > 1 ? "S" : ""}
            </span>
            <span className="font-mono text-[0.5rem] text-text-faint leading-none shrink-0 transition-colors duration-150 group-hover:text-accent">
              ▼
            </span>
          </button>
        ) : (
          <div className="h-[1.55rem]" />
        ))}
    </div>
  );
}
