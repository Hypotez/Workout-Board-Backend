import dotenv from 'dotenv'
import { z } from "zod";
import { nonEmptyStringSchema, urlSchema, uuidSchema } from '../schemas/shared/common';

import logger from '../logger/logger'

dotenv.config()

const EnvSchema = z.object({
    PORT: nonEmptyStringSchema,
    NODE_ENV: z.enum(['development', 'production'], 'NODE_ENV must be either "development" or "production"'),
    FRONTEND_URL: urlSchema,
    HEVY_URL: urlSchema,
    HEVY_API_KEY: uuidSchema
})

const result = EnvSchema.safeParse(process.env)

if (!result.success) {
  logger.error('Invalid environment variables:', result.error.message)
  process.exit(1)
}

export default result.data