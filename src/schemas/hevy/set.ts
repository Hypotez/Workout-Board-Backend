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

const CreateWorkoutSetSchema = SetSchema.omit({ index: true });
const GetRoutineSetSchema = SetSchema.omit({ rpe: true });
const CreateRoutineSetSchema = GetRoutineSetSchema.omit({ index: true });

export const SetsSchema = z.array(SetSchema);
export const CreateWorkoutSetsSchema = z.array(CreateWorkoutSetSchema);
export const GetRoutineSetsSchema = z.array(GetRoutineSetSchema);
export const CreateRoutineSetsSchema = z.array(CreateRoutineSetSchema);