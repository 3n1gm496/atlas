import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';

const profileSchema = z.object({
  displayName: z.string().min(2).max(80),
  bio: z.string().max(500).optional()
});

export async function PATCH(req: NextRequest) {
  const user = await getRequestUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = profileSchema.parse(await req.json());
  if (String(user.id).startsWith('demo-')) {
    return NextResponse.json({
      id: user.id,
      displayName: body.displayName,
      email: user.email,
      bio: body.bio ?? ''
    });
  }

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
      payload: { displayName: body.displayName, bio: body.bio ?? '' }
    }
  }).catch(() => undefined);

  return NextResponse.json(updated);
}
