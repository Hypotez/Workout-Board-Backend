import { z } from "zod";
import { ExercisesSchema, CreateExercisesSchema } from "./exercise";
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

const WorkoutCreateSchema = WorkoutSchema
  .omit({ id: true, created_at: true, updated_at: true })
  .extend({
    is_private: z.boolean(),
    exercises: CreateExercisesSchema
  })

export const WorkoutPayloadSchema = z.object({
  workout: WorkoutCreateSchema
});

export const WorkoutCreateResponseSchema = z.object({
  workout: WorkoutsSchema
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
export type WorkoutPayload = z.infer<typeof WorkoutPayloadSchema>;