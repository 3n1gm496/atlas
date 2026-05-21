'use client';

import { useState } from 'react';
import { useI18n } from '@/components/i18n-provider';

type Props = {
  entryId: string;
  initialFavorite: boolean;
  canSubmit: boolean;
  canFavorite: boolean;
};

export function EntryActions({ entryId, initialFavorite, canSubmit, canFavorite }: Props) {
  const { t } = useI18n();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [status, setStatus] = useState('');

  async function toggleFavorite() {
    const next = !favorite;
    setFavorite(next);
    await fetch('/api/account/favorites', {
      method: next ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId })
    });
  }

  async function submitForReview() {
    setStatus(t('entryActions.submitting'));
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId })
    });
    const data = await response.json();
    setStatus(response.ok ? t('entryActions.submitted') : data.error?.message ?? t('entryActions.error'));
  }

  return (
    <div className="atlas-card space-y-3">
      <p className="atlas-kicker">{t('entryActions.kicker')}</p>
      <div className="flex flex-wrap gap-3">
        {canFavorite ? (
          <button onClick={toggleFavorite} className="atlas-link-secondary" type="button">
            {favorite ? t('entryActions.removeFavorite') : t('entryActions.addFavorite')}
          </button>
        ) : null}
        {canSubmit ? (
          <button onClick={submitForReview} className="atlas-link-primary" type="button">
            {t('entryActions.sendToReview')}
          </button>
        ) : null}
      </div>
      {status ? <p className="text-sm text-neutral-700">{status}</p> : null}
    </div>
  );
}
