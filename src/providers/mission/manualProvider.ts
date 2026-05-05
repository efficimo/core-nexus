import { MOCK_EPICS } from "@core-nexus/data/mockEpics";
import type { MissionProvider } from "./types";

export const manualProvider: MissionProvider = {
  id: "manual",
  label: "Directives manuelles",
  async fetchEpics() {
    return MOCK_EPICS;
  },
};
