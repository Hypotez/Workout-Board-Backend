import { z } from 'zod';

export const GetRoutinesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(10).default(10),
});

export type GetRoutinesQuery = z.infer<typeof GetRoutinesQuerySchema>;
