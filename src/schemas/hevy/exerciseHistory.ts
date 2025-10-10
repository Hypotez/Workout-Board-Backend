import { z } from 'zod';

import { uuidSchema, dateSchema } from '../shared/common';

export const GetExerciseHistorySchema = z.object({
  workout_id: uuidSchema,
  workout_title: z.string(),
  workout_start_time: dateSchema,
  workout_end_time: dateSchema,
  exercise_template_id: z.string(),
  weight_kg: z.number().nullable(),
  reps: z.number().nullable(),
  distance_meters: z.number().nullable(),
  duration_seconds: z.number().nullable(),
  rpe: z.number().nullable(),
  custom_metric: z.number().nullable(),
  set_type: z.string(),
});

export const GetExercisesHistorySchema = z.object({
  exercise_history: z.array(GetExerciseHistorySchema),
});

export type GetExercisesHistory = z.infer<typeof GetExercisesHistorySchema>;
