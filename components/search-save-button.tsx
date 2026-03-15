'use client';

import { useState } from 'react';

export function SearchSaveButton({ query }: { query: string }) {
  const [status, setStatus] = useState('');

  async function save() {
    if (!query.trim()) return;
    const response = await fetch('/api/account/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: `Ricerca: ${query}`,
        query: { summary: `Preset salvato per la query "${query}"`, q: query }
      })
    });
    const data = await response.json();
    setStatus(response.ok ? `Ricerca salvata: ${data.label ?? query}` : data.error ?? 'Impossibile salvare.');
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={save} className="atlas-link-secondary">
        Salva questa ricerca
      </button>
      {status ? <p className="text-sm text-neutral-700">{status}</p> : null}
    </div>
  );
}
