import { z } from "zod";

export const sparkDataSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.enum(["idea", "in-progress", "done"]),
  tags: z.array(z.string()),
  authors: z.array(z.string()),
});

export const sparkSchema = sparkDataSchema.extend({
  id: z.string(),
});

export const sparksRecordSchema = z.record(z.string(), sparkDataSchema);

export type Spark = z.infer<typeof sparkSchema>;
