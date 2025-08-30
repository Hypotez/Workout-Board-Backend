import { z } from "zod";

const SetSchema = z.object({
  index: z.number(),
  type: z.string(),
  weight_kg: z.number().nullable(),
  reps: z.number().nullable(),
  distance_meters: z.number().nullable(),
  duration_seconds: z.number().nullable(),
  rpe: z.number().nullable(),
  custom_metric: z.number().nullable()
});

export const SetsSchema = z.array(SetSchema);