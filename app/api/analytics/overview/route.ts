export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (!hasRequiredRole(role, 'research_admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [byStatus, byCountry, featured, totalEntries] = await Promise.all([
    prisma.entry.groupBy({ by: ['status'], _count: true }),
    prisma.entry.groupBy({ by: ['countryId'], _count: true }),
    prisma.entry.count({ where: { featured: true } }),
    prisma.entry.count()
  ]);

  return NextResponse.json({ byStatus, byCountry, featured, totalEntries });
}
