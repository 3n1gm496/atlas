import { z } from 'zod';
import { appModes } from '@/lib/app-mode';

const envSchema = z.object({
  DATABASE_URL: z.string().url().default('postgresql://atlas:atlas@localhost:5432/atlas'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_MODE: z.enum(appModes).optional(),
  ATLAS_AUTO_SEED: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000')
});

export type AtlasEnv = z.infer<typeof envSchema>;
const developmentAuthSecret = 'atlas-dev-secret-please-change-2026';

function isProductionLikeMode(env: AtlasEnv) {
  return env.NODE_ENV === 'production' || env.APP_MODE === 'production' || env.APP_MODE === 'staging';
}

function normalizeTargetURL(url: string) {
  return new URL(url).toString().replace(/\/$/, '');
}

export function getEnv(): AtlasEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  return parsed.data;
}

export function getAuthSecret() {
  const secret = process.env.NEXTAUTH_SECRET ?? developmentAuthSecret;
  const appMode = process.env.APP_MODE;
  const isProductionLike = process.env.NODE_ENV === 'production' || appMode === 'production' || appMode === 'staging';

  if (isProductionLike && secret === developmentAuthSecret) {
    throw new Error('NEXTAUTH_SECRET must be set in production-like runtimes');
  }

  return secret;
}

export function getRuntimeReadiness() {
  const env = getEnv();
  const issues: string[] = [];
  const autoSeedEnabled = ['1', 'true', 'yes', 'on'].includes((env.ATLAS_AUTO_SEED ?? '').toLowerCase());
  const productionLike = isProductionLikeMode(env);

  if (productionLike) {
    if (!env.APP_MODE || env.APP_MODE === 'demo') {
      issues.push('APP_MODE must be set to production or staging in production-like runtime');
    }

    if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET === developmentAuthSecret) {
      issues.push('NEXTAUTH_SECRET must be set to a non-default value in production-like runtime');
    }

    if (normalizeTargetURL(env.NEXT_PUBLIC_APP_URL) !== normalizeTargetURL(env.NEXTAUTH_URL)) {
      issues.push('NEXTAUTH_URL and NEXT_PUBLIC_APP_URL must match in production-like runtime');
    }
  }

  if (autoSeedEnabled) {
    issues.push('ATLAS_AUTO_SEED must be false in a production-like runtime');
  }

  return {
    ok: issues.length === 0,
    issues,
    env
  };
}
