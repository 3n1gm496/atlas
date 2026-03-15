export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { listEntries, createEntry } from '@/lib/services/entries';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const result = await listEntries(params);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (!hasRequiredRole(role, 'contributor')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const entry = await createEntry(body, 'seed-contributor-id');
  return NextResponse.json(entry, { status: 201 });
}
