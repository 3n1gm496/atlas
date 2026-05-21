export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRoleFromRequest, hasRequiredRole } from '@/lib/auth/rbac';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';

export async function GET(req: NextRequest) {
  try {
    const user = await getRequestUser();
    const role = (user?.role?.name as ReturnType<typeof getRoleFromRequest>) ?? getRoleFromRequest(req);
    if (!hasRequiredRole(role, 'research_admin')) {
      throw new AtlasApiError(403, 'forbidden', 'Research admin permissions required');
    }

    const [byStatus, byCountry, featured, totalEntries] = await Promise.all([
      prisma.entry.groupBy({ by: ['status'], _count: true }),
      prisma.entry.groupBy({ by: ['countryId'], _count: true }),
      prisma.entry.count({ where: { featured: true } }),
      prisma.entry.count()
    ]);

    return apiSuccess({ byStatus, byCountry, featured, totalEntries });
  } catch (error) {
    return handleApiError(error);
  }
}
