import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';

const notificationSchema = z.object({
  notificationId: z.string().min(1),
  read: z.boolean().default(true)
});

export async function PATCH(req: NextRequest) {
  const user = await getRequestUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { notificationId, read } = notificationSchema.parse(await req.json());
  if (String(user.id).startsWith('demo-')) {
    return NextResponse.json({ id: notificationId, read, demo: true });
  }

  const updated = await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { read }
  });

  return NextResponse.json({ ok: updated.count > 0 });
}
