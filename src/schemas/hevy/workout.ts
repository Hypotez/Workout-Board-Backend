import { z } from "zod";
import { ExercisesSchema } from "./exercise";
import { dateSchema, uuidSchema } from "../shared/common";

export const WorkoutSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  description: z.string(),
  start_time: dateSchema,
  end_time: dateSchema,
  updated_at: dateSchema,
  created_at: dateSchema,
  exercises: ExercisesSchema
})

const WorkoutsSchema = z.array(WorkoutSchema)

export const createWorkoutSchema = z.object({
  workout: WorkoutSchema
});

export const WorkoutResponseSchema = z.object({
  page: z.number(),
  page_count: z.number(),
  workouts: WorkoutsSchema
})

export const WorkoutCountsSchema = z.object({
  workout_count: z.number()
});

export type SingleWorkoutResponse = z.infer<typeof WorkoutSchema>;
export type AllWorkoutResponse = z.infer<typeof WorkoutsSchema>;
export type WorkoutCountsResponse = z.infer<typeof WorkoutCountsSchema>;
export type WorkoutResponse = z.infer<typeof WorkoutResponseSchema>;