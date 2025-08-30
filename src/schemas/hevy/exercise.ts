import { z } from "zod";
import { SetsSchema } from "./set";

const ExerciseSchema = z.object({
  index: z.number(),
  title: z.string(),
  notes: z.string(),
  exercise_template_id: z.string(),
  superset_id: z.number().nullable(),
  sets: SetsSchema
});

export const ExercisesSchema = z.array(ExerciseSchema)