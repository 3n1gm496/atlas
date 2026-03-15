export const dynamic = 'force-dynamic';
import { ZodError } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { listEntries, createEntry } from '@/lib/services/entries';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';

async function resolveContributorId(req: NextRequest) {
  const requested = req.headers.get('x-atlas-user-id');
  if (requested) return requested;

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
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (!hasRequiredRole(role, 'contributor')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const contributorId = await resolveContributorId(req);
    const entry = await createEntry(body, contributorId);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: error.issues }, { status: 400 });
    }

    if (error instanceof Error && error.message.includes('database')) {
      return NextResponse.json({ error: 'Database unavailable. Retry shortly.' }, { status: 503 });
    }

    return NextResponse.json({ error: 'Unable to create entry' }, { status: 500 });
  }
}
