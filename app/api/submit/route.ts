export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';
import { patchEntry } from '@/lib/services/entries';
import { getRequestUser } from '@/lib/auth/request-user';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const submitSchema = z.object({
  entryId: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const user = await getRequestUser();
  const role = (user?.role?.name as ReturnType<typeof getRoleFromRequest>) ?? getRoleFromRequest(req);
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
  const entry = await prisma.entry.findUnique({ where: { id: payload.entryId } });
  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }
  if (user && entry.contributorId !== user.id && role !== 'super_admin') {
    return NextResponse.json({ error: 'Cannot submit this entry' }, { status: 403 });
  }

  const updated = await patchEntry(payload.entryId, { status: 'submitted' });

  if (user && !String(user.id).startsWith('demo-')) {
    await Promise.allSettled([
      prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'entry.submit',
          payload: { entryId: updated.id, status: updated.status }
        }
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Submission inviata',
          body: `La entry ${entry.title} e stata inviata alla review editoriale.`
        }
      })
    ]);
  }

  return NextResponse.json({ id: updated.id, status: updated.status });
}
