import dotenv from 'dotenv'
import { z } from "zod";

import logger from '../logger/logger.js'

dotenv.config()

const EnvSchema = z.object({
    PORT: z.string().min(1, 'PORT must be a non-empty string'),
    NODE_ENV: z.enum(['development', 'production'], 'NODE_ENV must be either "development" or "production"'),
    FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL')
})

const result = EnvSchema.safeParse(process.env)

if (!result.success) {
  logger.error('Invalid environment variables:', result.error.message)
  process.exit(1)
}

export default result.data