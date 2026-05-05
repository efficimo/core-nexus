import type { Epic } from "@core-nexus/types/mission";

export interface MissionProvider {
  id: string;
  label: string;
  fetchEpics(): Promise<Epic[]>;
}
