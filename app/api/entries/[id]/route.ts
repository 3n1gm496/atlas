export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { getEntryById, patchEntry } from '@/lib/services/entries';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';
import { getRequestUser } from '@/lib/auth/request-user';
import { prisma } from '@/lib/prisma';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getEntryById(id);
  if (!entry) return handleApiError(new AtlasApiError(404, 'not_found', 'Entry not found'));
  return apiSuccess(entry);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getRequestUser();
    const role = (user?.role?.name as ReturnType<typeof getRoleFromRequest>) ?? getRoleFromRequest(req);
    const current = await prisma.entry.findUnique({ where: { id } });
    if (!current) {
      throw new AtlasApiError(404, 'not_found', 'Entry not found');
    }

    const rawBody = await req.text();
    let body: Record<string, unknown> = {};
    if (rawBody.trim()) {
      try {
        body = JSON.parse(rawBody) as Record<string, unknown>;
      } catch {
        body = {};
      }
    }
    const isContributorEditingOwnDraft =
      user &&
      current.contributorId === user.id &&
      ['draft', 'changes_requested'].includes(current.status) &&
      !('status' in body);

    if (!isContributorEditingOwnDraft && !hasRequiredRole(role, 'editor')) {
      throw new AtlasApiError(403, 'forbidden', 'Editorial permissions required');
    }
    if (Object.keys(body).length === 0) {
      return apiSuccess(current);
    }

    const updated = await patchEntry(id, body, user?.id);
    if (!updated) {
      throw new AtlasApiError(404, 'not_found', 'Entry not found');
    }

    if (user) {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'entry.update',
          payload: { entryId: updated.id, changes: Object.keys(body) }
        }
      }).catch(() => undefined);
    }

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
