export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const groups = await prisma.taxonomyGroup.findMany({
    include: { terms: { orderBy: { labelIt: 'asc' } } },
    orderBy: { slug: 'asc' }
  });

  return NextResponse.json(groups);
}
