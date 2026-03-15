'use client';

import { useState } from 'react';

type SearchItem = {
  id: string;
  label: string;
  summary: string;
};

export function SavedSearchesManager({ initialItems }: { initialItems: SearchItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [label, setLabel] = useState('');
  const [summary, setSummary] = useState('');

  async function addSearch() {
    if (!label.trim()) return;
    const response = await fetch('/api/account/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, query: { summary } })
    });
    const data = await response.json();
    if (response.ok) {
      setItems((current) => [...current, { id: data.id, label: data.label, summary: String(data.query?.summary ?? summary) }]);
      setLabel('');
      setSummary('');
    }
  }

  async function removeSearch(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    await fetch('/api/account/saved-searches', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  }

  return (
    <div className="space-y-4">
      <div className="atlas-card grid gap-3">
        <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Etichetta ricerca" className="rounded-2xl border border-atlas-muted px-4 py-3" />
        <textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Descrizione o query rapida" className="rounded-2xl border border-atlas-muted px-4 py-3" />
        <button type="button" onClick={addSearch} className="atlas-link-primary w-fit">Salva ricerca</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="atlas-card text-sm">
            <p className="font-semibold">{item.label}</p>
            <p className="mt-2 text-neutral-700">{item.summary}</p>
            <button type="button" onClick={() => removeSearch(item.id)} className="mt-3 text-xs underline">Rimuovi</button>
          </div>
        ))}
      </div>
    </div>
  );
}
