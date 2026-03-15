export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getEntryById, patchEntry } from '@/lib/services/entries';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const entry = await getEntryById(params.id);
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const role = getRoleFromRequest(req);
  if (!hasRequiredRole(role, 'editor')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const updated = await patchEntry(params.id, body);
  return NextResponse.json(updated);
}
