import { z } from 'zod';

export const GetExerciseTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  primary_muscle_group: z.string(),
  secondary_muscle_groups: z.array(z.string()),
  is_custom: z.boolean(),
});

export const GetExerciseTemplatesSchema = z.object({
  page: z.number(),
  page_count: z.number(),
  exercise_templates: z.array(GetExerciseTemplateSchema),
});

export type GetExerciseTemplate = z.infer<typeof GetExerciseTemplateSchema>;
export type GetExerciseTemplates = z.infer<typeof GetExerciseTemplatesSchema>;
