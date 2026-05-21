import { afterEach, describe, expect, it, vi } from 'vitest';

describe('auth secret policy', () => {
  afterEach(() => {
    vi.resetModules();
    Reflect.deleteProperty(process.env, 'NODE_ENV');
    Reflect.deleteProperty(process.env, 'NEXTAUTH_SECRET');
  });

  it('allows development fallback secret', async () => {
    process.env = { ...process.env, NODE_ENV: 'development' };
    const { getAuthSecret } = await import('../../lib/env');
    expect(getAuthSecret()).toBe('atlas-dev-secret-please-change-2026');
  });

  it('rejects default secret in production', async () => {
    process.env = { ...process.env, NODE_ENV: 'production' };
    const { getAuthSecret } = await import('../../lib/env');
    expect(() => getAuthSecret()).toThrow(/NEXTAUTH_SECRET must be set in production/);
  });

  it('marks runtime not ready when production APP_MODE is missing', async () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'production',
      NEXTAUTH_SECRET: 'production-secret-0123456789-production'
    };
    const { getRuntimeReadiness } = await import('../../lib/env');
    expect(getRuntimeReadiness()).toMatchObject({
      ok: false
    });
  });

  it('marks runtime ready when production env is complete', async () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'production',
      APP_MODE: 'production',
      NEXTAUTH_SECRET: 'production-secret-0123456789-production',
      DATABASE_URL: 'postgresql://atlas:atlas@localhost:5432/atlas',
      NEXT_PUBLIC_APP_URL: 'https://atlas.example.com',
      NEXTAUTH_URL: 'https://atlas.example.com'
    };
    const { getRuntimeReadiness } = await import('../../lib/env');
    expect(getRuntimeReadiness()).toMatchObject({
      ok: true,
      issues: []
    });
  });

  it('marks runtime not ready when auto seed is enabled', async () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'development',
      APP_MODE: 'staging',
      ATLAS_AUTO_SEED: 'true'
    };
    const { getRuntimeReadiness } = await import('../../lib/env');
    expect(getRuntimeReadiness()).toMatchObject({
      ok: false,
      issues: expect.arrayContaining([expect.stringMatching(/ATLAS_AUTO_SEED must be false/)]) 
    });
  });
});
