import { z } from 'zod';

export const SettingsSchema = z.object({
  hevy_api_key: z.string().default(''),
  use_hevy_api: z.boolean().default(false),
});

export type Settings = z.infer<typeof SettingsSchema>;
