import { z } from "zod";
import { ExercisesSchema, CreateExercisesSchema } from "./exercise";
import { dateSchema, uuidSchema } from "../shared/common";

export const GetWorkoutSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  description: z.string(),
  start_time: dateSchema,
  end_time: dateSchema,
  updated_at: dateSchema,
  created_at: dateSchema,
  exercises: ExercisesSchema
})

const GetAllWorkoutsSchema = z.array(GetWorkoutSchema)

const CreateWorkoutSchema = GetWorkoutSchema
  .omit({ id: true, created_at: true, updated_at: true })
  .extend({
    is_private: z.boolean(),
    exercises: CreateExercisesSchema
  })

export const CreateOrUpdateWorkoutSchema = z.object({
  workout: CreateWorkoutSchema
});

export const CreateOrUpdateWorkoutResponseSchema = z.object({
  workout: GetAllWorkoutsSchema
});

export const GetPaginatedWorkoutsResponseSchema = z.object({
  page: z.number(),
  page_count: z.number(),
  workouts: GetAllWorkoutsSchema
})

export const GetWorkoutsCountsSchema = z.object({
  workout_count: z.number()
});

export type GetWorkout = z.infer<typeof GetWorkoutSchema>;
export type GetAllWorkouts = z.infer<typeof GetAllWorkoutsSchema>;
export type GetWorkoutsCounts = z.infer<typeof GetWorkoutsCountsSchema>;
export type GetPaginatedWorkouts = z.infer<typeof GetPaginatedWorkoutsResponseSchema>;
export type CreateOrUpdateWorkout = z.infer<typeof CreateOrUpdateWorkoutSchema>;