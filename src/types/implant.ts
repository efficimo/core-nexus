import { z } from "zod";

export const implantDataSchema = z.object({
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  authors: z.array(z.string()),
});

export const implantSchema = implantDataSchema.extend({
  id: z.string(),
});

export const implantsRecordSchema = z.record(z.string(), implantDataSchema);

export type Implant = z.infer<typeof implantSchema>;
