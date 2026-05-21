import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';
import { resolveReviewTransition } from '@/lib/workflows/entry-workflow';
import { reviewPriorities } from '@/lib/validation/entry';

export const dynamic = 'force-dynamic';

const reviewSchema = z.object({
  entryId: z.string().min(1),
  action: z.enum(['start_review', 'request_changes', 'approve', 'publish', 'reject']),
  comment: z.string().trim().max(1000).optional(),
  reviewPriority: z.enum(reviewPriorities).optional(),
  reviewDueAt: z
    .union([z.coerce.date(), z.null()])
    .optional()
});

const triageSchema = z.object({
  entryId: z.string().min(1),
  reviewerId: z.string().min(1).nullable().optional(),
  reviewPriority: z.enum(reviewPriorities).optional(),
  reviewDueAt: z
    .union([z.coerce.date(), z.null()])
    .optional(),
  note: z.string().trim().max(1000).optional()
});

async function getReviewPayload(entryId: string) {
  const entry = await prisma.entry.findUnique({
    where: { id: entryId },
    include: {
      reviewer: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        take: 3
      }
    }
  });

  if (!entry) {
    throw new AtlasApiError(404, 'not_found', 'Entry not found');
  }

  return {
    id: entry.id,
    status: entry.status,
    reviewerId: entry.reviewerId,
    reviewerName: entry.reviewer?.displayName ?? null,
    reviewPriority: entry.reviewPriority,
    reviewDueAt: entry.reviewDueAt?.toISOString() ?? null,
    commentCount: entry.comments.length,
    recentNotes: entry.comments.map((comment) => ({
      id: comment.id,
      author: comment.author.displayName,
      content: comment.content,
      createdAt: comment.createdAt.toISOString()
    }))
  };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user) {
      throw new AtlasApiError(401, 'unauthorized', 'Authentication required');
    }

    const body = reviewSchema.parse(await req.json());
    const entry = await prisma.entry.findUnique({ where: { id: body.entryId } });
    if (!entry) {
      throw new AtlasApiError(404, 'not_found', 'Entry not found');
    }

    const nextStatus = resolveReviewTransition(body.action, entry.status, user.role.name as never);
    const reviewPriority = body.reviewPriority ?? entry.reviewPriority;
    const reviewDueAt = body.reviewDueAt === undefined ? entry.reviewDueAt : body.reviewDueAt;
    const updated = await prisma.entry.update({
      where: { id: body.entryId },
      data: {
        status: nextStatus,
        reviewerId: user.id,
        reviewPriority,
        reviewDueAt,
        reviewStartedAt: body.action === 'start_review' ? new Date() : entry.reviewStartedAt,
        statusChangedAt: new Date(),
        publishedAt: body.action === 'publish' ? new Date() : entry.publishedAt
      }
    });

    const operations: Promise<unknown>[] = [
      prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: `entry.review.${body.action}`,
          payload: {
            entryId: body.entryId,
            comment: body.comment ?? null,
            nextStatus,
            reviewPriority,
            reviewDueAt: reviewDueAt?.toISOString() ?? null
          }
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
          body: `La tua entry ${entry.title} e ora nello stato ${nextStatus}.`
        }
      })
    );

    await Promise.allSettled(operations);

    return apiSuccess(await getReviewPayload(updated.id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user) {
      throw new AtlasApiError(401, 'unauthorized', 'Authentication required');
    }

    const body = triageSchema.parse(await req.json());
    const entry = await prisma.entry.findUnique({ where: { id: body.entryId } });
    if (!entry) {
      throw new AtlasApiError(404, 'not_found', 'Entry not found');
    }

    const reviewerId = body.reviewerId ?? null;
    if (reviewerId) {
      const reviewer = await prisma.user.findUnique({
        where: { id: reviewerId },
        include: { role: true }
      });
      if (!reviewer || !['editor', 'research_admin', 'super_admin'].includes(reviewer.role.name)) {
        throw new AtlasApiError(400, 'invalid_reviewer', 'Selected reviewer is not eligible for editorial review');
      }
    }

    const reviewPriority = body.reviewPriority ?? 'medium';
    const reviewDueAt = body.reviewDueAt === undefined ? null : body.reviewDueAt;

    const updated = await prisma.entry.update({
      where: { id: body.entryId },
      data: {
        reviewerId,
        reviewPriority,
        reviewDueAt
      }
    });

    const operations: Promise<unknown>[] = [
      prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'entry.review.triage',
          payload: {
            entryId: body.entryId,
            reviewerId,
            reviewPriority,
            reviewDueAt: reviewDueAt?.toISOString() ?? null,
            note: body.note ?? null
          }
        }
      })
    ];

    if (body.note) {
      operations.push(
        prisma.submissionComment.create({
          data: {
            entryId: body.entryId,
            authorId: user.id,
            content: body.note
          }
        })
      );
    }

    await Promise.allSettled(operations);

    return apiSuccess(await getReviewPayload(updated.id));
  } catch (error) {
    return handleApiError(error);
  }
}
