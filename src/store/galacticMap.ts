import { MOCK_EPICS } from "@core-nexus/data/mockEpics";
import type { Epic, Mission } from "@core-nexus/types/mission";
import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface GalacticMapState {
  epics: Epic[];
}

// ---------------------------------------------------------------------------
// Observable store
// ---------------------------------------------------------------------------

class GalacticMapStore {
  private _state: GalacticMapState = { epics: MOCK_EPICS };
  private _listeners = new Set<() => void>();

  // --- Lecture ---

  get state(): GalacticMapState {
    return this._state;
  }

  /** Stable snapshot pour useSyncExternalStore */
  getSnapshot = (): GalacticMapState => this._state;

  /** Abonnement pour useSyncExternalStore */
  subscribe = (listener: () => void): (() => void) => {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  };

  // --- Écriture ---

  private commit(next: GalacticMapState) {
    this._state = next;
    this._listeners.forEach((l) => {
      l();
    });
  }

  setEpics(epics: Epic[]) {
    this.commit({ ...this._state, epics });
  }

  addEpic(epic: Epic) {
    this.commit({ ...this._state, epics: [...this._state.epics, epic] });
  }

  removeEpic(epicId: string) {
    this.commit({ ...this._state, epics: this._state.epics.filter((e) => e.id !== epicId) });
  }

  updateEpic(epicId: string, patch: Partial<Omit<Epic, "id" | "states" | "missions" | "color">>) {
    this.commit({
      ...this._state,
      epics: this._state.epics.map((e) => (e.id !== epicId ? e : { ...e, ...patch })),
    });
  }

  updateMission(epicId: string, missionId: string, patch: Partial<Omit<Mission, "id">>) {
    this.commit({
      ...this._state,
      epics: this._state.epics.map((e) =>
        e.id !== epicId
          ? e
          : {
              ...e,
              missions: e.missions.map((m) => (m.id !== missionId ? m : { ...m, ...patch })),
            },
      ),
    });
  }

  moveMission(fromEpicId: string, missionId: string, toEpicId: string, newStateId: string) {
    const fromEpic = this._state.epics.find((e) => e.id === fromEpicId);
    const mission = fromEpic?.missions.find((m) => m.id === missionId);
    if (!mission) return;

    const updated = { ...mission, epicId: toEpicId, stateId: newStateId };
    this.commit({
      ...this._state,
      epics: this._state.epics.map((e) => {
        if (e.id === fromEpicId && fromEpicId !== toEpicId)
          return { ...e, missions: e.missions.filter((m) => m.id !== missionId) };
        if (e.id === toEpicId && fromEpicId !== toEpicId)
          return { ...e, missions: [...e.missions, updated] };
        if (e.id === fromEpicId && fromEpicId === toEpicId)
          return { ...e, missions: e.missions.map((m) => (m.id !== missionId ? m : updated)) };
        return e;
      }),
    });
  }
}

export const galacticMapStore = new GalacticMapStore();

// ---------------------------------------------------------------------------
// Hook React
// ---------------------------------------------------------------------------

export function useGalacticMap(): GalacticMapState {
  return useSyncExternalStore(galacticMapStore.subscribe, galacticMapStore.getSnapshot);
}
