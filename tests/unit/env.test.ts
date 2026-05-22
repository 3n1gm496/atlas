import { afterEach, describe, expect, it, vi } from 'vitest';

describe('auth secret policy', () => {
  afterEach(() => {
    vi.resetModules();
    Reflect.deleteProperty(process.env, 'NODE_ENV');
    Reflect.deleteProperty(process.env, 'APP_MODE');
    Reflect.deleteProperty(process.env, 'NEXTAUTH_SECRET');
    Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_APP_URL');
    Reflect.deleteProperty(process.env, 'NEXTAUTH_URL');
    Reflect.deleteProperty(process.env, 'ATLAS_AUTO_SEED');
    Reflect.deleteProperty(process.env, 'DATABASE_URL');
  });

  it('allows development fallback secret in plain local development', async () => {
    process.env = { ...process.env, NODE_ENV: 'development' };
    const { getAuthSecret } = await import('../../lib/env');
    expect(getAuthSecret()).toBe('atlas-dev-secret-please-change-2026');
  });

  it('rejects default secret in production-like staging', async () => {
    process.env = { ...process.env, NODE_ENV: 'development', APP_MODE: 'staging' };
    const { getAuthSecret } = await import('../../lib/env');
    expect(() => getAuthSecret()).toThrow(/NEXTAUTH_SECRET must be set in production-like runtimes/);
  });

  it('rejects default secret in production', async () => {
    process.env = { ...process.env, NODE_ENV: 'production' };
    const { getAuthSecret } = await import('../../lib/env');
    expect(() => getAuthSecret()).toThrow(/NEXTAUTH_SECRET must be set in production-like runtimes/);
  });

  it('marks runtime not ready when production APP_MODE is missing', async () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'production',
      NEXTAUTH_SECRET: 'production-secret-0123456789-production',
      NEXT_PUBLIC_APP_URL: 'https://atlas.example.com',
      NEXTAUTH_URL: 'https://atlas.example.com'
    };
    const { getRuntimeReadiness } = await import('../../lib/env');
    expect(getRuntimeReadiness()).toMatchObject({
      ok: false
    });
  });

  it('marks runtime not ready when production-like URLs differ', async () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'development',
      APP_MODE: 'staging',
      NEXTAUTH_SECRET: 'production-secret-0123456789-production',
      NEXT_PUBLIC_APP_URL: 'https://atlas.example.com',
      NEXTAUTH_URL: 'https://atlas.example.net'
    };
    const { getRuntimeReadiness } = await import('../../lib/env');
    expect(getRuntimeReadiness()).toMatchObject({
      ok: false,
      issues: expect.arrayContaining([expect.stringMatching(/NEXTAUTH_URL and NEXT_PUBLIC_APP_URL must match/)])
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
      NEXTAUTH_SECRET: 'production-secret-0123456789-production',
      NEXT_PUBLIC_APP_URL: 'https://atlas.example.com',
      NEXTAUTH_URL: 'https://atlas.example.com',
      ATLAS_AUTO_SEED: 'true'
    };
    const { getRuntimeReadiness } = await import('../../lib/env');
    expect(getRuntimeReadiness()).toMatchObject({
      ok: false,
      issues: expect.arrayContaining([expect.stringMatching(/ATLAS_AUTO_SEED must be false/)]) 
    });
  });
});
