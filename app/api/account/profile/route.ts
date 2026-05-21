import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';

export const dynamic = 'force-dynamic';

const profileSchema = z.object({
  displayName: z.string().min(2).max(80)
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user) {
      throw new AtlasApiError(401, 'unauthorized', 'Authentication required');
    }

    const body = profileSchema.parse(await req.json());
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: body.displayName
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'user.profile.update',
        payload: { displayName: body.displayName }
      }
    }).catch(() => undefined);

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
