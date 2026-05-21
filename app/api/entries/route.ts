export const dynamic = 'force-dynamic';
import { ZodError } from 'zod';
import { NextRequest } from 'next/server';
import { listEntries, createEntry } from '@/lib/services/entries';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';

async function resolveContributorId(req: NextRequest) {
  const requested = req.headers.get('x-atlas-user-id');
  if (requested) return requested;

  const currentUser = await getRequestUser();
  if (currentUser && ['contributor', 'super_admin', 'editor', 'research_admin'].includes(currentUser.role.name)) {
    return currentUser.id;
  }

  const contributor = await prisma.user.findFirst({
    where: { role: { name: { in: ['contributor', 'super_admin'] } } },
    select: { id: true }
  });

  if (!contributor) throw new Error('No contributor user available');
  return contributor.id;
}

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const result = await listEntries(params);
  return apiSuccess(result);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser();
    const role = (user?.role?.name as ReturnType<typeof getRoleFromRequest>) ?? getRoleFromRequest(req);
    if (!hasRequiredRole(role, 'contributor')) {
      throw new AtlasApiError(403, 'forbidden', 'Contributor permissions required');
    }

    const body = await req.json();
    const contributorId = await resolveContributorId(req);
    const entry = await createEntry(body, contributorId);

    await prisma.auditLog.create({
      data: {
        actorId: contributorId,
        action: 'entry.create',
        payload: { entryId: entry.id, slug: entry.slug }
      }
    }).catch(() => undefined);

    return apiSuccess(entry, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return handleApiError(error);
    return handleApiError(error);
  }
}
