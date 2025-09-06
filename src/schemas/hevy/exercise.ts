import { z } from "zod";
import { SetsSchema, CreateWorkoutSetsSchema, GetRoutineSetsSchema, CreateRoutineSetsSchema } from "./set";

const ExerciseSchema = z.object({
  index: z.number(),
  title: z.string(),
  notes: z.string(),
  exercise_template_id: z.string(),
  superset_id: z.number().nullable(),
  sets: SetsSchema
});

const CreateExerciseSchema = ExerciseSchema.omit({ index: true, title: true }).extend({sets: CreateWorkoutSetsSchema});
const GetRoutineExerciseSchema = ExerciseSchema.extend({rest_seconds: z.number(), sets: GetRoutineSetsSchema, notes: z.string().nullable()});
const CreateRoutineExerciseSchema = GetRoutineExerciseSchema.omit({ index: true, title: true }).extend({sets: CreateRoutineSetsSchema});

export const ExercisesSchema = z.array(ExerciseSchema)
export const CreateExercisesSchema = z.array(CreateExerciseSchema);
export const GetRoutineExercisesSchema = z.array(GetRoutineExerciseSchema);
export const CreateRoutineExercisesSchema = z.array(CreateRoutineExerciseSchema);