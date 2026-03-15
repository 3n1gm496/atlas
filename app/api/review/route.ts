import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';

const reviewSchema = z.object({
  entryId: z.string().min(1),
  action: z.enum(['start_review', 'request_changes', 'approve', 'publish', 'reject']),
  comment: z.string().trim().max(1000).optional()
});

const actionToStatus = {
  start_review: 'under_review',
  request_changes: 'changes_requested',
  approve: 'approved',
  publish: 'published',
  reject: 'rejected'
} as const;

export async function POST(req: NextRequest) {
  const user = await getRequestUser();
  if (!user || !['editor', 'research_admin', 'super_admin'].includes(user.role.name)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = reviewSchema.parse(await req.json());
  const entry = await prisma.entry.findUnique({ where: { id: body.entryId } });
  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  if (String(user.id).startsWith('demo-')) {
    return NextResponse.json({
      ok: true,
      demo: true,
      entryId: body.entryId,
      status: actionToStatus[body.action]
    });
  }

  const updated = await prisma.entry.update({
    where: { id: body.entryId },
    data: {
      status: actionToStatus[body.action],
      reviewerId: user.id,
      publishedAt: body.action === 'publish' ? new Date() : entry.publishedAt
    }
  });

  const operations: Promise<unknown>[] = [
    prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: `entry.review.${body.action}`,
        payload: { entryId: body.entryId, comment: body.comment ?? null }
      }
    })
  ];

  if (body.comment) {
    operations.push(
      prisma.submissionComment.create({
        data: {
          entryId: body.entryId,
          authorId: user.id,
          content: body.comment
        }
      })
    );
  }

  operations.push(
    prisma.notification.create({
      data: {
        userId: entry.contributorId,
        title: 'Aggiornamento review',
        body: `La tua entry ${entry.title} e ora nello stato ${actionToStatus[body.action]}.`
      }
    })
  );

  await Promise.allSettled(operations);

  return NextResponse.json(updated);
}
