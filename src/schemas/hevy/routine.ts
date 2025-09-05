import { z } from "zod";
import { uuidSchema, dateSchema } from "../shared/common";
import { GetRoutineExercisesSchema, CreateRoutineExercisesSchema } from "./exercise";

const GetRoutineSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  folder_id: z.number().nullable(),
  updated_at: dateSchema,
  created_at: dateSchema,
  exercises: GetRoutineExercisesSchema
});

const GetRoutinesSchema = z.array(GetRoutineSchema);

export const CreateRoutinesPayloadSchema = z.object({
  routine: GetRoutineSchema.omit({ id: true, created_at: true, updated_at: true }).extend({exercises: CreateRoutineExercisesSchema})
});

export const UpdateRoutinesPayloadSchema = z.object({
  routine: GetRoutineSchema.omit({ id: true, created_at: true, updated_at: true, folder_id: true }).extend({exercises: CreateRoutineExercisesSchema})
});
export const GetRoutineResponseSchema = z.object({
  routine: GetRoutineSchema
})

export const CreateRoutineResponseSchema = z.object({
  routine: GetRoutinesSchema
})

export const GetRoutinesResponseSchema = z.object({
  page: z.number(),
  page_count: z.number(),
  routines: GetRoutinesSchema
});

export type GetRoutinesResponse = z.infer<typeof GetRoutinesResponseSchema>;
export type GetRoutineResponse = z.infer<typeof GetRoutineResponseSchema>;
export type CreateRoutine = z.infer<typeof CreateRoutinesPayloadSchema>;
export type CreateRoutineResponse = z.infer<typeof CreateRoutineResponseSchema>;
export type UpdateRoutine = z.infer<typeof UpdateRoutinesPayloadSchema>;