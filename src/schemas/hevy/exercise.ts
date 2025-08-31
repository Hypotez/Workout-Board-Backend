import { z } from "zod";
import { SetsSchema, CreateSetsSchema } from "./set";

const ExerciseSchema = z.object({
  index: z.number(),
  title: z.string(),
  notes: z.string(),
  exercise_template_id: z.string(),
  superset_id: z.number().nullable(),
  sets: SetsSchema
});

const CreateExerciseSchema = ExerciseSchema.omit({ index: true, title: true }).extend({sets: CreateSetsSchema});

export const CreateExercisesSchema = z.array(CreateExerciseSchema);
export const ExercisesSchema = z.array(ExerciseSchema)