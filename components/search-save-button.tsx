'use client';

import { useState } from 'react';

export function SearchSaveButton({ query }: { query: string }) {
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!query.trim()) return;
    try {
      setSaving(true);
      const response = await fetch('/api/account/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: `Search: ${query}`,
          query: { summary: `Saved preset for query "${query}"`, q: query }
        })
      });
      const data = await response.json();
      setStatus(response.ok ? `Search saved: ${data.data.label ?? query}` : data.error?.message ?? 'Unable to save.');
    } catch {
      setStatus('Network error while saving the search.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={save} disabled={saving} className="atlas-link-secondary disabled:opacity-60">
        {saving ? 'Saving…' : 'Save this search'}
      </button>
      {status ? <p className="text-sm text-neutral-700" aria-live="polite">{status}</p> : null}
    </div>
  );
}
