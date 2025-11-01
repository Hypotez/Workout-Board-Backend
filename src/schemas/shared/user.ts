import { z } from 'zod';
import { uuidSchema, nonEmptyStringSchema } from './common';

export const PublicUserSchema = z.object({
  id: uuidSchema,
  username: nonEmptyStringSchema,
  email: nonEmptyStringSchema,
  created_at: z.date(),
  updated_at: z.date(),
});

export type PublicUser = z.infer<typeof PublicUserSchema>;
