export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';
import { patchEntry } from '@/lib/services/entries';
import { z } from 'zod';

const submitSchema = z.object({
  entryId: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (!hasRequiredRole(role, 'contributor')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const limit = checkRateLimit(`submit:${ip}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfterMs: limit.retryAfterMs },
      { status: 429 }
    );
  }

  const payload = submitSchema.parse(await req.json());
  const updated = await patchEntry(payload.entryId, { status: 'submitted' });

  return NextResponse.json({ id: updated.id, status: updated.status });
}
