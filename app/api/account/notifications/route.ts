import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';

export const dynamic = 'force-dynamic';

const notificationSchema = z.object({
  notificationId: z.string().min(1),
  read: z.boolean().default(true)
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user) throw new AtlasApiError(401, 'unauthorized', 'Authentication required');

    const { notificationId, read } = notificationSchema.parse(await req.json());
    const updated = await prisma.notification.updateMany({
      where: { id: notificationId, userId: user.id },
      data: { read }
    });

    return apiSuccess({ ok: updated.count > 0 });
  } catch (error) {
    return handleApiError(error);
  }
}
