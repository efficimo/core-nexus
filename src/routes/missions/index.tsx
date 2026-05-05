import { EPICS_PAGE_SIZE } from "@core-nexus/components/missions/config";
import { EpicPanel } from "@core-nexus/components/missions/EpicPanel";
import type { SelectedMission } from "@core-nexus/components/missions/GalacticMap";
import { GalacticMap } from "@core-nexus/components/missions/GalacticMap";
import type { DetailTarget } from "@core-nexus/components/missions/MissionDetail";
import { MissionDetail } from "@core-nexus/components/missions/MissionDetail";
import { MissionLegend } from "@core-nexus/components/missions/MissionLegend";
import { galacticMapStore, useGalacticMap } from "@core-nexus/store/galacticMap";
import type { Epic } from "@core-nexus/types/mission";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/missions/")({
  component: MissionsPage,
});

function MissionsPage() {
  const { epics } = useGalacticMap();
  const [selectedTarget, setSelectedTarget] = useState<DetailTarget | null>(null);
  const [hoveredEpicId, setHoveredEpicId] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const safeStart = Math.min(
    startIndex,
    Math.floor((epics.length - 1) / EPICS_PAGE_SIZE) * EPICS_PAGE_SIZE,
  );
  const displayedEpics =
    epics.length > EPICS_PAGE_SIZE ? epics.slice(safeStart, safeStart + EPICS_PAGE_SIZE) : epics;

  const selectedMissionId = selectedTarget?.kind === "mission" ? selectedTarget.mission.id : null;
  const selectedEpicId = selectedTarget?.kind === "epic" ? selectedTarget.epic.id : null;

  const totalMissions = epics.reduce((n, e) => n + e.missions.length, 0);
  const integrated = epics.reduce((n, e) => n + e.missions.filter((m) => m.integrated).length, 0);

  const reactiveTarget = useMemo((): DetailTarget | null => {
    if (!selectedTarget) return null;
    if (selectedTarget.kind === "epic") {
      const fresh = epics.find((e) => e.id === selectedTarget.epic.id);
      return fresh ? { kind: "epic", epic: fresh } : null;
    }
    for (const epic of epics) {
      const mission = epic.missions.find((m) => m.id === selectedTarget.mission.id);
      if (mission) {
        const si = epic.states.findIndex((s) => s.id === mission.stateId);
        return {
          kind: "mission",
          mission,
          epicTitle: epic.title,
          epicColor: epic.color,
          stateLabel: epic.states[si]?.label ?? mission.stateId,
        };
      }
    }
    return null;
  }, [selectedTarget, epics]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (selectedTarget?.kind !== "mission") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const allMissions = epics.flatMap((ep) => ep.missions.filter((m) => !m.integrated));
      const idx = allMissions.findIndex((m) => m.id === selectedTarget.mission.id);
      if (idx === -1) return;
      const next =
        e.key === "ArrowRight"
          ? allMissions[(idx + 1) % allMissions.length]
          : allMissions[(idx - 1 + allMissions.length) % allMissions.length];
      if (!next) return;
      for (const epic of epics) {
        const mission = epic.missions.find((m) => m.id === next.id);
        if (mission) {
          const si = epic.states.findIndex((s) => s.id === mission.stateId);
          setSelectedTarget({
            kind: "mission",
            mission,
            epicTitle: epic.title,
            epicColor: epic.color,
            stateLabel: epic.states[si]?.label ?? mission.stateId,
          });
          return;
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedTarget, epics]);

  function handleMissionClick(info: SelectedMission) {
    setSelectedTarget((prev) =>
      prev?.kind === "mission" && prev.mission.id === info.mission.id
        ? null
        : { kind: "mission", ...info },
    );
  }

  function handleEpicSelect(epic: Epic | null) {
    setSelectedTarget((prev) =>
      epic === null
        ? null
        : prev?.kind === "epic" && prev.epic.id === epic.id
          ? null
          : { kind: "epic", epic },
    );
  }

  function handleTagAdd(tag: string) {
    if (!reactiveTarget) return;
    if (reactiveTarget.kind === "mission") {
      const { mission } = reactiveTarget;
      galacticMapStore.updateMission(mission.epicId, mission.id, { tags: [...mission.tags, tag] });
    } else {
      galacticMapStore.updateEpic(reactiveTarget.epic.id, {
        tags: [...reactiveTarget.epic.tags, tag],
      });
    }
  }

  function handleTagRemove(tag: string) {
    if (!reactiveTarget) return;
    if (reactiveTarget.kind === "mission") {
      const { mission } = reactiveTarget;
      galacticMapStore.updateMission(mission.epicId, mission.id, {
        tags: mission.tags.filter((t) => t !== tag),
      });
    } else {
      galacticMapStore.updateEpic(reactiveTarget.epic.id, {
        tags: reactiveTarget.epic.tags.filter((t) => t !== tag),
      });
    }
  }

  return (
    <div className="grid [grid-template-rows:auto_1fr] [grid-template-columns:240px_1fr_260px] gap-y-[0.75rem] gap-x-4 h-full overflow-hidden">
      <div className="[grid-column:1/-1] flex items-end justify-between">
        <div className="flex flex-col gap-[0.15rem]">
          <span className="font-mono text-[0.5rem] tracking-[0.25em] text-text-faint">
            CARTE GALACTIQUE
          </span>
          <h1 className="font-display text-[1.1rem] font-bold tracking-[0.12em] text-text m-0">
            Directives de Campagne
          </h1>
        </div>
        <div className="flex items-center gap-[1.2rem]">
          <span className="flex flex-col items-end gap-[0.1rem]">
            <span className="font-display text-[1.3rem] font-bold text-accent leading-none">
              {epics.length}
            </span>
            <span className="font-mono text-[0.45rem] tracking-[0.2em] text-text-faint">
              FRONTS
            </span>
          </span>
          <span className="flex flex-col items-end gap-[0.1rem]">
            <span className="font-display text-[1.3rem] font-bold text-accent leading-none">
              {totalMissions}
            </span>
            <span className="font-mono text-[0.45rem] tracking-[0.2em] text-text-faint">
              DIRECTIVES
            </span>
          </span>
          <span className="flex flex-col items-end gap-[0.1rem]">
            <span
              className="font-display text-[1.3rem] font-bold leading-none"
              style={{ color: "var(--connected)" }}
            >
              {integrated}
            </span>
            <span className="font-mono text-[0.45rem] tracking-[0.2em] text-text-faint">
              INTÉGRÉES
            </span>
          </span>
        </div>
      </div>

      <EpicPanel
        epics={epics}
        startIndex={safeStart}
        onStartIndexChange={setStartIndex}
        hoveredEpicId={hoveredEpicId}
        onHover={setHoveredEpicId}
        selectedEpicId={selectedEpicId}
        onSelect={handleEpicSelect}
      />

      <div className="min-h-0 overflow-hidden flex items-stretch justify-center">
        <GalacticMap
          epics={displayedEpics}
          selectedMissionId={selectedMissionId ?? undefined}
          hoveredEpicId={hoveredEpicId}
          onMissionUpdate={(epicId, missionId, patch) => {
            galacticMapStore.updateMission(epicId, missionId, patch);
            if (
              patch.integrated &&
              selectedTarget?.kind === "mission" &&
              selectedTarget.mission.id === missionId
            ) {
              setSelectedTarget(null);
            }
          }}
          onMissionClick={handleMissionClick}
        />
      </div>

      <div className="grid [grid-template-rows:auto_1fr] gap-[0.75rem] min-h-0 overflow-hidden">
        <MissionLegend />
        <div className="min-h-0 overflow-hidden flex flex-col">
          {reactiveTarget && (
            <MissionDetail
              target={reactiveTarget}
              onClose={() => setSelectedTarget(null)}
              onTagAdd={handleTagAdd}
              onTagRemove={handleTagRemove}
            />
          )}
        </div>
      </div>
    </div>
  );
}
