export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { apiSuccess } from '@/lib/http/api';

export async function GET() {
  const groups = await prisma.taxonomyGroup.findMany({
    include: { terms: { orderBy: { labelIt: 'asc' } } },
    orderBy: { slug: 'asc' }
  });

  return apiSuccess(groups);
}
