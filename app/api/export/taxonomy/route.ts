import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getRequestUser();
    if (!user || !['research_admin', 'super_admin'].includes(user.role.name)) {
      throw new AtlasApiError(403, 'forbidden', 'Administrative export permissions required');
    }

    const groups = await prisma.taxonomyGroup.findMany({
      include: { terms: true },
      orderBy: { slug: 'asc' }
    });

    return apiSuccess({ items: groups, total: groups.length });
  } catch (error) {
    return handleApiError(error);
  }
}
