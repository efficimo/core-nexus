import { z } from "zod";

export const architectSkillSchema = z.object({
  skillId: z.string(),
  level: z.number(),
});

export const architectDataSchema = z.object({
  name: z.string(),
  pseudo: z.string(),
  email: z.string(),
  title: z.string(),
  class: z.string(),
  level: z.number(),
  avatar: z.string(),
  skills: z.array(architectSkillSchema),
  quote: z.string(),
  lore: z.string(),
});

export const architectSchema = architectDataSchema.extend({
  id: z.string(),
});

export const architectsRecordSchema = z.record(z.string(), architectDataSchema);

export type ArchitectSkill = z.infer<typeof architectSkillSchema>;
export type Architect = z.infer<typeof architectSchema>;
