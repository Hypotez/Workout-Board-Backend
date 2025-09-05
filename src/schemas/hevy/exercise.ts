import { z } from "zod";
import { SetsSchema, CreateSetsSchema, GetRoutineSetsSchema, CreateRoutineSetsSchema } from "./set";

const ExerciseSchema = z.object({
  index: z.number(),
  title: z.string(),
  notes: z.string(),
  exercise_template_id: z.string(),
  superset_id: z.number().nullable(),
  sets: SetsSchema
});

const CreateExerciseSchema = ExerciseSchema.omit({ index: true, title: true }).extend({sets: CreateSetsSchema});
const GetRoutineExerciseSchema = ExerciseSchema.extend({rest_seconds: z.number(), sets: GetRoutineSetsSchema, notes: z.string().nullable()});
const CreateRoutineExerciseSchema = GetRoutineExerciseSchema.omit({ index: true, title: true }).extend({sets: CreateRoutineSetsSchema});

export const CreateExercisesSchema = z.array(CreateExerciseSchema);
export const ExercisesSchema = z.array(ExerciseSchema)
export const GetRoutineExercisesSchema = z.array(GetRoutineExerciseSchema);
export const CreateRoutineExercisesSchema = z.array(CreateRoutineExerciseSchema);