'use client';

import { useState } from 'react';

type Props = {
  entryId: string;
  initialFavorite: boolean;
  canSubmit: boolean;
  canFavorite: boolean;
};

export function EntryActions({ entryId, initialFavorite, canSubmit, canFavorite }: Props) {
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
    setStatus('Invio in corso...');
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId })
    });
    const data = await response.json();
    setStatus(response.ok ? 'Entry inviata alla review.' : data.error ?? 'Errore durante l invio.');
  }

  return (
    <div className="atlas-card space-y-3">
      <p className="atlas-kicker">Azioni rapide</p>
      <div className="flex flex-wrap gap-3">
        {canFavorite ? (
          <button onClick={toggleFavorite} className="atlas-link-secondary" type="button">
            {favorite ? 'Rimuovi preferito' : 'Aggiungi ai preferiti'}
          </button>
        ) : null}
        {canSubmit ? (
          <button onClick={submitForReview} className="atlas-link-primary" type="button">
            Invia a review
          </button>
        ) : null}
      </div>
      {status ? <p className="text-sm text-neutral-700">{status}</p> : null}
    </div>
  );
}
