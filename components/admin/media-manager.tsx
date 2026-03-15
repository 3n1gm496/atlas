'use client';

import { useState } from 'react';

type MediaItem = {
  id: string;
  kind: string;
  url: string;
  altText: string;
  entryId: string;
};

export function MediaManager({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [entryId, setEntryId] = useState('');
  const [kind, setKind] = useState('image');
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [status, setStatus] = useState('');

  async function onCreate() {
    setStatus('Creazione asset...');
    const response = await fetch('/api/admin/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId, kind, url, altText })
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? 'Errore durante la creazione asset.');
      return;
    }
    setItems((current) => [data, ...current]);
    setEntryId('');
    setUrl('');
    setAltText('');
    setStatus('Asset creato.');
  }

  return (
    <div className="space-y-4">
      <div className="atlas-card grid gap-3 md:grid-cols-2">
        <input value={entryId} onChange={(event) => setEntryId(event.target.value)} placeholder="Entry ID" className="rounded-2xl border border-atlas-muted px-4 py-3" />
        <input value={kind} onChange={(event) => setKind(event.target.value)} placeholder="Tipo media" className="rounded-2xl border border-atlas-muted px-4 py-3" />
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="URL media" className="rounded-2xl border border-atlas-muted px-4 py-3 md:col-span-2" />
        <input value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Alt text" className="rounded-2xl border border-atlas-muted px-4 py-3 md:col-span-2" />
        <button type="button" onClick={onCreate} className="atlas-link-primary w-fit">Aggiungi asset</button>
        {status ? <p className="text-sm text-neutral-700">{status}</p> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="atlas-card text-sm">
            <p className="font-semibold">{item.kind}</p>
            <p className="mt-2 break-all text-neutral-700">{item.url}</p>
            <p className="mt-2 text-neutral-500">entry: {item.entryId}</p>
            <p className="mt-1 text-neutral-500">{item.altText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
