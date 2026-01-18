import { z } from 'zod';
import { nonEmptyStringSchema } from './common';

export const PublicUserSchema = z.object({
  id: z.string(),
  username: nonEmptyStringSchema,
  email: nonEmptyStringSchema,
  created_at: z.date(),
  updated_at: z.date(),
});

export type PublicUser = z.infer<typeof PublicUserSchema>;
