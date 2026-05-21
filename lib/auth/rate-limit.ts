import type { NextRequest } from 'next/server';

const bucket = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const state = bucket.get(key);

  if (!state || state.resetAt < now) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (state.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: state.resetAt - now };
  }

  state.count += 1;
  bucket.set(key, state);
  return { ok: true, remaining: limit - state.count };
}

export function getRateLimitKey(req: NextRequest, prefix: string) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
  return `${prefix}:${clientIp}`;
}
