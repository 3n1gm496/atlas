import { EntryStatus } from '@prisma/client';
import { AtlasRole } from '@/lib/auth/rbac';
import { AtlasApiError } from '@/lib/http/api';

export const reviewActions = ['start_review', 'request_changes', 'approve', 'publish', 'reject'] as const;
export type ReviewAction = (typeof reviewActions)[number];

const reviewTransitions: Record<ReviewAction, EntryStatus> = {
  start_review: 'under_review',
  request_changes: 'changes_requested',
  approve: 'approved',
  publish: 'published',
  reject: 'rejected'
};

const reviewActionsByStatus: Record<EntryStatus, ReviewAction[]> = {
  draft: [],
  submitted: ['start_review', 'request_changes', 'approve', 'reject'],
  under_review: ['request_changes', 'approve', 'reject'],
  changes_requested: ['start_review', 'approve', 'reject'],
  approved: ['publish', 'request_changes'],
  published: [],
  rejected: [],
  archived: []
};

const allowedTransitions: Record<EntryStatus, EntryStatus[]> = {
  draft: ['submitted', 'archived'],
  submitted: ['under_review', 'changes_requested', 'approved', 'rejected'],
  under_review: ['changes_requested', 'approved', 'rejected'],
  changes_requested: ['draft', 'submitted', 'archived'],
  approved: ['published', 'changes_requested', 'archived'],
  published: ['archived'],
  rejected: ['draft', 'archived'],
  archived: []
};

export function canTransitionEntryStatus(current: EntryStatus, next: EntryStatus) {
  return allowedTransitions[current].includes(next);
}

export function assertTransitionAllowed(current: EntryStatus, next: EntryStatus) {
  if (!canTransitionEntryStatus(current, next)) {
    throw new AtlasApiError(409, 'invalid_transition', `Cannot move entry from ${current} to ${next}`);
  }
}

export function resolveReviewTransition(action: ReviewAction, current: EntryStatus, role: AtlasRole) {
  if (!['editor', 'research_admin', 'super_admin'].includes(role)) {
    throw new AtlasApiError(403, 'forbidden', 'Only editorial roles can review entries');
  }

  const next = reviewTransitions[action];
  assertTransitionAllowed(current, next);
  return next;
}

export function getReviewActionsForStatus(status: EntryStatus | string): ReviewAction[] {
  return reviewActionsByStatus[status as EntryStatus] ?? [];
}

export function resolveSubmissionTransition(current: EntryStatus) {
  assertTransitionAllowed(current, 'submitted');
  return 'submitted';
}
