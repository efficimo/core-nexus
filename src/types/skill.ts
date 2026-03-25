import { z } from "zod";

export const skillDataSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  maxLevel: z.number(),
});

export const skillSchema = skillDataSchema.extend({
  id: z.string(),
});

export const skillsRecordSchema = z.record(z.string(), skillDataSchema);

export type Skill = z.infer<typeof skillSchema>;
