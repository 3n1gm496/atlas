export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getEntryById, patchEntry } from '@/lib/services/entries';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';
import { getRequestUser } from '@/lib/auth/request-user';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const entry = await getEntryById(params.id);
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getRequestUser();
  const role = (user?.role?.name as ReturnType<typeof getRoleFromRequest>) ?? getRoleFromRequest(req);
  const current = await prisma.entry.findUnique({ where: { id: params.id } });
  if (!current) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();
  const isContributorEditingOwnDraft =
    user &&
    current.contributorId === user.id &&
    ['draft', 'changes_requested'].includes(current.status) &&
    !('status' in body);

  if (!isContributorEditingOwnDraft && !hasRequiredRole(role, 'editor')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const updated = await patchEntry(params.id, body);

  if (user && !String(user.id).startsWith('demo-')) {
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'entry.update',
        payload: { entryId: updated.id, changes: Object.keys(body) }
      }
    }).catch(() => undefined);
  }

  return NextResponse.json(updated);
}
