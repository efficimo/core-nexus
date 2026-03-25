import { z } from "zod";

export const sigilDataSchema = z.object({
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  architectIds: z.array(z.string()),
});

export const sigilSchema = sigilDataSchema.extend({
  id: z.string(),
});

export const sigilsRecordSchema = z.record(z.string(), sigilDataSchema);

export type Sigil = z.infer<typeof sigilSchema>;
