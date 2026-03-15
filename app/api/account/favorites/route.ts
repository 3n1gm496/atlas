import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';

const favoriteSchema = z.object({
  entryId: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const user = await getRequestUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { entryId } = favoriteSchema.parse(await req.json());
  if (String(user.id).startsWith('demo-')) {
    return NextResponse.json({ ok: true, demo: true, entryId });
  }

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

  return NextResponse.json(favorite);
}

export async function DELETE(req: NextRequest) {
  const user = await getRequestUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { entryId } = favoriteSchema.parse(await req.json());
  if (String(user.id).startsWith('demo-')) {
    return NextResponse.json({ ok: true, demo: true, entryId });
  }

  await prisma.favorite.deleteMany({
    where: { userId: user.id, entryId }
  });

  return NextResponse.json({ ok: true });
}
