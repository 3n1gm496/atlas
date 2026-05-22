'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getReviewActionsForStatus, type ReviewAction } from '@/lib/workflows/entry-workflow';
import { useI18n } from '@/components/i18n-provider';
import { getStatusLabel } from '@/lib/content/labels';

type ReviewItem = {
  id: string;
  title: string;
  status: string;
  slug: string;
  contributorName: string;
  reviewerId: string | null;
  reviewerName: string | null;
  updatedAt: string;
  reviewPriority: string;
  reviewDueAt: string | null;
  commentCount: number;
  recentNotes: { id: string; author: string; content: string; createdAt: string }[];
};

type Reviewer = {
  id: string;
  displayName: string;
  roleName: string;
};

const actions = [
  { value: 'start_review', labelKey: 'review.actions.start' },
  { value: 'request_changes', labelKey: 'review.actions.changes' },
  { value: 'approve', labelKey: 'review.actions.approve' },
  { value: 'publish', labelKey: 'review.actions.publish' },
  { value: 'reject', labelKey: 'review.actions.reject', danger: true }
] as const satisfies ReadonlyArray<{ value: ReviewAction; labelKey: string; danger?: boolean }>;

export function ReviewBoard({ initialItems, reviewers }: { initialItems: ReviewItem[]; reviewers: Reviewer[] }) {
  const { t, locale } = useI18n();
  const [items, setItems] = useState(initialItems);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [reviewersByEntry, setReviewersByEntry] = useState<Record<string, string>>(
    Object.fromEntries(initialItems.map((item) => [item.id, item.reviewerId ?? '']))
  );
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(initialItems[0]?.id ?? null);
  const [statusMessage, setStatusMessage] = useState('');
  const [pendingEntryId, setPendingEntryId] = useState<string | null>(null);

  async function saveTriage(entryId: string) {
    try {
      setPendingEntryId(entryId);
      const note = feedback[entryId] ?? '';
      const response = await fetch('/api/review', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryId,
          reviewerId: reviewersByEntry[entryId] || null,
          reviewPriority: 'medium',
          reviewDueAt: null,
          note
        })
      });

      if (!response.ok) {
        const body = await response.json();
        setStatusMessage(body.error?.message ?? t('review.errors.assign'));
        return;
      }

      const data = await response.json();
      setItems((current) =>
        current.map((item) =>
          item.id === entryId
            ? {
                ...item,
                reviewerId: data.data?.reviewerId ?? reviewersByEntry[entryId] ?? null,
                reviewerName: data.data?.reviewerName ?? null,
                reviewPriority: data.data?.reviewPriority ?? item.reviewPriority,
                reviewDueAt: data.data?.reviewDueAt ?? item.reviewDueAt,
                commentCount: data.data?.commentCount ?? item.commentCount,
                recentNotes: data.data?.recentNotes ?? item.recentNotes
              }
            : item
        )
      );
      setFeedback((current) => ({ ...current, [entryId]: '' }));
      setStatusMessage(t('review.messages.assign'));
    } catch {
      setStatusMessage(t('review.errors.network'));
    } finally {
      setPendingEntryId(null);
    }
  }

  async function applyAction(entryId: string, action: ReviewAction) {
    try {
      setPendingEntryId(entryId);
      const comment = feedback[entryId] ?? '';
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryId,
          action,
          comment,
          reviewPriority: 'medium',
          reviewDueAt: null
        })
      });

      if (!response.ok) {
        const body = await response.json();
        setStatusMessage(body.error?.message ?? t('review.errors.action'));
        return;
      }

      const data = await response.json();
      setItems((current) =>
        current.map((item) =>
          item.id === entryId
            ? {
                ...item,
                status: data.data?.status ?? item.status,
                reviewerId: data.data?.reviewerId ?? item.reviewerId,
                reviewerName: data.data?.reviewerName ?? item.reviewerName,
                reviewPriority: data.data?.reviewPriority ?? item.reviewPriority,
                reviewDueAt: data.data?.reviewDueAt ?? item.reviewDueAt,
                commentCount: data.data?.commentCount ?? item.commentCount,
                recentNotes: data.data?.recentNotes ?? item.recentNotes
              }
            : item
        )
      );
      setFeedback((current) => ({ ...current, [entryId]: '' }));
      setStatusMessage(t('review.messages.status'));
    } catch {
      setStatusMessage(t('review.errors.network'));
    } finally {
      setPendingEntryId(null);
    }
  }

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const haystack = `${item.title} ${item.contributorName} ${item.reviewerName ?? ''}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      return matchesQuery;
    });
  }, [items, query]);
  const assignedVisibleCount = visibleItems.filter((item) => item.reviewerId).length;
  const unassignedVisibleCount = visibleItems.length - assignedVisibleCount;

  const selectedItem = visibleItems.find((item) => item.id === selectedId) ?? visibleItems[0] ?? null;

  return (
    <div className="grid gap-4 xl:grid-cols-[0.56fr_0.44fr]">
      <section className="atlas-dark-card space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="atlas-kicker">{t('review.inboxKicker')}</p>
            <h2 className="text-3xl font-semibold text-white">{t('review.inboxTitle')}</h2>
          </div>
          <p className="max-w-md text-sm text-white/68">{t('review.inboxDescription')}</p>
        </div>

        <div className="atlas-toolbar grid gap-3 md:grid-cols-[1.1fr_auto]">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-[color:var(--atlas-ink-1)]">{t('review.searchLabel')}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="atlas-input"
              placeholder={t('review.searchPlaceholder')}
              aria-label={t('review.searchAria')}
            />
          </label>
          <div className="flex items-end">
            <div className="atlas-panel w-full py-3 text-center">
              <p className="atlas-meta">{t('review.visibleLabel')}</p>
              <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{visibleItems.length}</p>
            </div>
          </div>
        </div>
        <div className="atlas-action-strip">
          <span className="atlas-chip atlas-chip-active">{t('review.visibleLabel')}: {visibleItems.length}</span>
          <span className="atlas-chip">{t('review.reviewerLabel')}: {assignedVisibleCount}</span>
          <span className="atlas-chip">{t('review.unassigned')}: {unassignedVisibleCount}</span>
        </div>

        <div className="atlas-worklist">
          {visibleItems.length === 0 ? (
            <div className="atlas-empty">{t('review.empty')}</div>
          ) : (
            visibleItems.map((item) => {
              const selected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`atlas-worklist-item ${selected ? 'atlas-worklist-item-active' : ''}`}
                >
                  <div className="grid gap-3 xl:grid-cols-[1fr_auto]">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-[family-name:var(--font-atlas-display)] text-2xl font-semibold leading-tight text-white">{item.title}</p>
                        <span className="atlas-chip atlas-chip-active border-white/10 bg-white/12 text-white">
                          {getStatusLabel(item.status, locale)}
                        </span>
                      </div>
                      <p className="text-sm text-white/72">
                        {t('review.byContributor', { name: item.contributorName })}
                        {item.reviewerName ? ` · ${t('review.assignedTo', { name: item.reviewerName })}` : ` · ${t('review.unassigned')}`}
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm text-white/76 xl:text-right">
                      <div>
                        <p className="atlas-meta text-white/52">{t('review.lastMove')}</p>
                        <p className="font-medium text-white">{new Date(item.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="atlas-meta text-white/52">{t('review.notes')}</p>
                        <p className="font-medium text-white">{item.commentCount}</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      <aside className="atlas-section-shell space-y-4 lg:sticky lg:top-24">
        {selectedItem ? (
          <>
            <div className="space-y-3">
              <p className="atlas-kicker">{t('review.selectedKicker')}</p>
              <h2 className="font-[family-name:var(--font-atlas-display)] text-5xl font-semibold leading-[0.94] text-[color:var(--atlas-ink-1)]">{selectedItem.title}</h2>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">
                {t('review.byContributor', { name: selectedItem.contributorName })} · {t('review.reviewerLabel')}:{' '}
                {selectedItem.reviewerName ?? t('review.unassigned')}
              </p>
              <div className="atlas-action-strip border-t border-[rgba(112,83,61,0.14)] pt-3">
                <span className="atlas-chip atlas-chip-active">{getStatusLabel(selectedItem.status, locale)}</span>
                <Link href={`/entry/${selectedItem.slug}`} className="atlas-link-secondary">
                  {t('review.openCard')}
                </Link>
              </div>
            </div>

            <div className="atlas-metric-grid">
              <article className="atlas-metric-card">
                <p className="atlas-meta">{t('review.notes')}</p>
                <strong>{selectedItem.commentCount}</strong>
              </article>
              <article className="atlas-metric-card">
                <p className="atlas-meta">{t('review.lastMove')}</p>
                <strong>{new Date(selectedItem.updatedAt).toLocaleDateString()}</strong>
              </article>
            </div>

            <div className="grid gap-3 md:grid-cols-1">
              <label className="grid gap-1 text-sm">
                <span>{t('review.reviewerLabel')}</span>
                <select
                  value={reviewersByEntry[selectedItem.id] ?? ''}
                  onChange={(event) => setReviewersByEntry((current) => ({ ...current, [selectedItem.id]: event.target.value }))}
                  className="atlas-select"
                  disabled={pendingEntryId === selectedItem.id}
                >
                  <option value="">{t('review.unassigned')}</option>
                  {reviewers.map((reviewer) => (
                    <option key={reviewer.id} value={reviewer.id}>
                      {reviewer.displayName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="atlas-dark-card space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-white">{t('review.recentNotes')}</p>
                <p className="text-xs text-white/62">{t('review.notesCount', { count: selectedItem.commentCount })}</p>
              </div>
              {selectedItem.recentNotes.length === 0 ? (
                <p className="text-sm text-white/74">{t('review.noNotes')}</p>
              ) : (
                <div className="space-y-2">
                  {selectedItem.recentNotes.map((note) => (
                    <article key={note.id} className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3">
                      <p className="text-xs text-white/58">
                        {note.author} · {new Date(note.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/82">{note.content}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <label className="grid gap-1 text-sm">
              <span>{t('review.nextStep')}</span>
              <textarea
                value={feedback[selectedItem.id] ?? ''}
                onChange={(event) => setFeedback((current) => ({ ...current, [selectedItem.id]: event.target.value }))}
                placeholder={t('review.nextStepPlaceholder')}
                className="atlas-textarea"
                disabled={pendingEntryId === selectedItem.id}
              />
            </label>

            <div className="atlas-action-strip">
              <button type="button" onClick={() => saveTriage(selectedItem.id)} className="atlas-link-secondary" disabled={pendingEntryId === selectedItem.id}>
                {pendingEntryId === selectedItem.id ? t('review.saving') : t('review.saveAssign')}
              </button>
              {actions
                .filter((action) => getReviewActionsForStatus(selectedItem.status).includes(action.value))
                .map((action) => (
                  <button
                    key={action.value}
                    type="button"
                    onClick={() => applyAction(selectedItem.id, action.value)}
                    disabled={pendingEntryId === selectedItem.id}
                    className={'danger' in action && action.danger ? 'atlas-link-danger' : 'atlas-link-primary'}
                  >
                    {t(action.labelKey)}
                  </button>
                ))}
            </div>
          </>
        ) : (
          <div className="atlas-empty">{t('review.emptySelection')}</div>
        )}

        {statusMessage ? <p className="text-sm text-[color:var(--atlas-ink-2)]" aria-live="polite">{statusMessage}</p> : null}
      </aside>
    </div>
  );
}
