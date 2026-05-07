import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().url(),

  JWT_ACCESS_TOKEN_SECRET: z.string().min(32),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(32),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),

  SWAGGER_ENABLED: z
    .union([z.literal('true'), z.literal('false')])
    .transform((v) => v === 'true')
    .default('true'),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.flatten();
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables', formatted);
    throw new Error('Invalid environment variables');
  }
  return parsed.data;
}

