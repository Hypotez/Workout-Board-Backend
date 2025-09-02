import { z } from "zod";
import { uuidSchema, dateSchema } from "../shared/common";
import { RoutineExercisesSchema } from "./exercise";

const RoutineSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  folder_id: z.number().nullable(),
  updated_at: dateSchema,
  created_at: dateSchema,
  exercises: RoutineExercisesSchema
});

const RoutinesSchema = z.array(RoutineSchema);

export const GetRoutineResponseSchema = z.object({
  routine: RoutineSchema
})

export const GetRoutinesResponseSchema = z.object({
  page: z.number(),
  page_count: z.number(),
  routines: RoutinesSchema
});

export type GetRoutinesResponse = z.infer<typeof GetRoutinesResponseSchema>;
export type GetRoutineResponse = z.infer<typeof GetRoutineResponseSchema>;