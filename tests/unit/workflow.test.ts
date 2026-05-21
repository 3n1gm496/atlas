import { describe, expect, it } from 'vitest';
import {
  assertTransitionAllowed,
  getReviewActionsForStatus,
  resolveReviewTransition,
  resolveSubmissionTransition
} from '../../lib/workflows/entry-workflow';

describe('entry workflow', () => {
  it('allows valid contributor submission transition', () => {
    expect(resolveSubmissionTransition('draft')).toBe('submitted');
  });

  it('rejects invalid submission transition', () => {
    expect(() => resolveSubmissionTransition('published')).toThrow(/Cannot move entry/);
  });

  it('allows editorial review actions', () => {
    expect(resolveReviewTransition('approve', 'under_review', 'editor')).toBe('approved');
  });

  it('blocks contributor review actions', () => {
    expect(() => resolveReviewTransition('approve', 'under_review', 'contributor')).toThrow(/Only editorial roles/);
  });

  it('enforces explicit transition matrix', () => {
    expect(() => assertTransitionAllowed('draft', 'published')).toThrow(/Cannot move entry/);
  });

  it('exposes contextual review actions for submitted entries', () => {
    expect(getReviewActionsForStatus('submitted')).toEqual(['start_review', 'request_changes', 'approve', 'reject']);
  });
});
