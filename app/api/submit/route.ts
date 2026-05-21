export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { checkRateLimit, getRateLimitKey } from '@/lib/auth/rate-limit';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';
import { patchEntry } from '@/lib/services/entries';
import { getRequestUser } from '@/lib/auth/request-user';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';
import { resolveSubmissionTransition } from '@/lib/workflows/entry-workflow';

const submitSchema = z.object({
  entryId: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser();
    const role = (user?.role?.name as ReturnType<typeof getRoleFromRequest>) ?? getRoleFromRequest(req);
    if (!hasRequiredRole(role, 'contributor')) {
      throw new AtlasApiError(403, 'forbidden', 'Contributor permissions required');
    }

    const limit = checkRateLimit(getRateLimitKey(req, 'submit'), 10, 60_000);
    if (!limit.ok) {
      throw new AtlasApiError(429, 'rate_limited', 'Too many requests', { retryAfterMs: limit.retryAfterMs });
    }

    const payload = submitSchema.parse(await req.json());
    const entry = await prisma.entry.findUnique({ where: { id: payload.entryId } });
    if (!entry) {
      throw new AtlasApiError(404, 'not_found', 'Entry not found');
    }
    if (user && entry.contributorId !== user.id && role !== 'super_admin') {
      throw new AtlasApiError(403, 'forbidden', 'Cannot submit this entry');
    }

    const nextStatus = resolveSubmissionTransition(entry.status);
    const updated = await patchEntry(payload.entryId, { status: nextStatus });
    if (!updated) {
      throw new AtlasApiError(404, 'not_found', 'Entry not found');
    }

    if (user) {
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

    return apiSuccess({ id: updated.id, status: updated.status });
  } catch (error) {
    return handleApiError(error);
  }
}
