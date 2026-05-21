import { describe, it, expect } from 'vitest';
import { hasRequiredRole } from '../../lib/auth/rbac';
import { checkRateLimit, getRateLimitKey } from '../../lib/auth/rate-limit';

describe('rbac', () => {
  it('allows editor capabilities for super_admin', () => {
    expect(hasRequiredRole('super_admin', 'editor')).toBe(true);
  });

  it('denies editor capabilities for contributor', () => {
    expect(hasRequiredRole('contributor', 'editor')).toBe(false);
  });
});

describe('rate limiting', () => {
  it('blocks when limit is exceeded', () => {
    const key = 'test-rate-limit';
    checkRateLimit(key, 1, 1000);
    const second = checkRateLimit(key, 1, 1000);
    expect(second.ok).toBe(false);
  });

  it('derives a stable key from forwarded headers', () => {
    const req = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '203.0.113.10, 10.0.0.1'
      }
    });
    expect(getRateLimitKey(req as never, 'register')).toBe('register:203.0.113.10');
  });
});
