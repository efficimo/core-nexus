import type { Spark } from "@core-nexus/types/spark";

export const statusVariant = {
  idea: "default",
  "in-progress": "warn",
  done: "connected",
} as const satisfies Record<Spark["status"], "default" | "warn" | "connected">;
