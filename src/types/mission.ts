import { z } from "zod";

export const epicStateSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const missionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  stateId: z.string(),
  epicId: z.string(),
  assignees: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  source: z.string().default("manual"),
  sourceRef: z.string().optional(),
  integrated: z.boolean().optional(),
});

export const epicSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  color: z.string(),
  tags: z.array(z.string()).default([]),
  states: z.array(epicStateSchema),
  missions: z.array(missionSchema),
});

export type EpicState = z.infer<typeof epicStateSchema>;
export type Mission = z.infer<typeof missionSchema>;
export type Epic = z.infer<typeof epicSchema>;
