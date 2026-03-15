import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';

export async function GET() {
  const user = await getRequestUser();
  if (!user || !['research_admin', 'super_admin'].includes(user.role.name)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const groups = await prisma.taxonomyGroup.findMany({
    include: { terms: true },
    orderBy: { slug: 'asc' }
  });

  return NextResponse.json({ items: groups, total: groups.length });
}
