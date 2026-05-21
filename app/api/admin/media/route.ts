import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';

export const dynamic = 'force-dynamic';

const mediaSchema = z.object({
  entryId: z.string().min(1),
  kind: z.string().min(2).max(40),
  url: z.string().url(),
  altText: z.string().min(2).max(160)
});

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user || !['editor', 'research_admin', 'super_admin'].includes(user.role.name)) {
      throw new AtlasApiError(403, 'forbidden', 'Editorial permissions required');
    }

    const body = mediaSchema.parse(await req.json());
    const media = await prisma.mediaAsset.create({ data: body });
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'media.create',
        payload: { mediaId: media.id, entryId: body.entryId, url: body.url }
      }
    }).catch(() => undefined);

    return apiSuccess(media, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
