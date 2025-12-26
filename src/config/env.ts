import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  PORT: z.number().min(1, 'Port cannot be empty').default(3000),
  NODE_ENV: z
    .enum(['development', 'production'], 'NODE_ENV must be either "development" or "production"')
    .default('development'),
  FRONTEND_URL: z.url('Not a valid URL').default('http://localhost:5173'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET cannot be empty').default('345'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET cannot be empty').default('123'),
  ENCRYPTION_KEY: z
    .string()
    .min(32, 'ENCRYPTION_KEY must be at least 32 characters long')
    .default('xfn9P8L9rIpKtWaa68IZ3G865WfdYXNY'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment variables:', result.error.message);
  process.exit(1);
}
export default result.data;
