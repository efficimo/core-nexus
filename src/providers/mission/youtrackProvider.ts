import type { Epic } from "@core-nexus/types/mission";
import type { MissionProvider } from "./types";

// Stub — sera connecté via OAuth YouTrack
export const youtrackProvider: MissionProvider = {
  id: "youtrack",
  label: "YouTrack",
  async fetchEpics(): Promise<Epic[]> {
    throw new Error(
      "YouTrack provider: OAuth non configuré. Branchez le connecteur OAuth pour activer ce provider.",
    );
  },
};
