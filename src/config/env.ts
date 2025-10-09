import dotenv from 'dotenv'
import { z } from "zod";
import { nonEmptyStringSchema, urlSchema, uuidSchema } from '../schemas/shared/common';

dotenv.config()

const EnvSchema = z.object({
    PORT: nonEmptyStringSchema,
    NODE_ENV: z.enum(['development', 'production'], 'NODE_ENV must be either "development" or "production"'),
    FRONTEND_URL: urlSchema,
    HEVY_URL: urlSchema,
    HEVY_API_KEY: uuidSchema,
    JWT_ACCESS_SECRET: nonEmptyStringSchema,
    JWT_REFRESH_SECRET: nonEmptyStringSchema,
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info')
})

const result = EnvSchema.safeParse(process.env)

if (!result.success) {
  console.error('Invalid environment variables:', result.error.message)
  process.exit(1)
}
export default result.data