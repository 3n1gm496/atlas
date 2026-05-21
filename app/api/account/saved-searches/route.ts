import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';

export const dynamic = 'force-dynamic';

const createSchema = z.object({
  label: z.string().min(2).max(80),
  query: z.record(z.string(), z.string()).default({})
});

const deleteSchema = z.object({
  id: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user) throw new AtlasApiError(401, 'unauthorized', 'Authentication required');

    const body = createSchema.parse(await req.json());
    const search = await prisma.savedSearch.create({
      data: {
        userId: user.id,
        label: body.label,
        query: body.query
      }
    });

    return apiSuccess(search, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user) throw new AtlasApiError(401, 'unauthorized', 'Authentication required');

    const { id } = deleteSchema.parse(await req.json());
    await prisma.savedSearch.deleteMany({
      where: { id, userId: user.id }
    });
    return apiSuccess({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
