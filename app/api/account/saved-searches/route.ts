import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';

const createSchema = z.object({
  label: z.string().min(2).max(80),
  query: z.record(z.string(), z.string()).default({})
});

const deleteSchema = z.object({
  id: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const user = await getRequestUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = createSchema.parse(await req.json());
  if (String(user.id).startsWith('demo-')) {
    return NextResponse.json({ id: `demo-${Date.now()}`, ...body, userId: user.id, demo: true });
  }

  const search = await prisma.savedSearch.create({
    data: {
      userId: user.id,
      label: body.label,
      query: body.query
    }
  });

  return NextResponse.json(search, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getRequestUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = deleteSchema.parse(await req.json());
  if (String(user.id).startsWith('demo-')) {
    return NextResponse.json({ ok: true, demo: true });
  }

  await prisma.savedSearch.deleteMany({
    where: { id, userId: user.id }
  });
  return NextResponse.json({ ok: true });
}
