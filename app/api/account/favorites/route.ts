import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';

export const dynamic = 'force-dynamic';

const favoriteSchema = z.object({
  entryId: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user) throw new AtlasApiError(401, 'unauthorized', 'Authentication required');

    const { entryId } = favoriteSchema.parse(await req.json());
    const favorite = await prisma.favorite.upsert({
      where: { id: `${user.id}:${entryId}` },
      update: {},
      create: {
        id: `${user.id}:${entryId}`,
        userId: user.id,
        entryId
      }
    }).catch(async () => {
      const existing = await prisma.favorite.findFirst({ where: { userId: user.id, entryId } });
      return existing ?? prisma.favorite.create({ data: { userId: user.id, entryId } });
    });

    return apiSuccess(favorite);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user) throw new AtlasApiError(401, 'unauthorized', 'Authentication required');

    const { entryId } = favoriteSchema.parse(await req.json());
    await prisma.favorite.deleteMany({
      where: { userId: user.id, entryId }
    });

    return apiSuccess({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
