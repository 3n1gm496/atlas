import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().default('postgresql://atlas:atlas@localhost:5432/atlas'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXTAUTH_SECRET: z.string().min(32).default('atlas-dev-secret-please-change-2026'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000')
});

export type AtlasEnv = z.infer<typeof envSchema>;

export function getEnv(): AtlasEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  return parsed.data;
}
