'use client';

import { useState } from 'react';
import { getStatusLabel } from '@/lib/demo-content';

type ReviewItem = {
  id: string;
  title: string;
  status: string;
  slug: string;
};

const actions = [
  { value: 'start_review', label: 'Avvia review' },
  { value: 'request_changes', label: 'Richiedi modifiche' },
  { value: 'approve', label: 'Approva' },
  { value: 'publish', label: 'Pubblica' },
  { value: 'reject', label: 'Rifiuta' }
] as const;

export function ReviewBoard({ initialItems }: { initialItems: ReviewItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  async function applyAction(entryId: string, action: (typeof actions)[number]['value']) {
    const comment = feedback[entryId] ?? '';
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId, action, comment })
    });
    if (!response.ok) return;
    const data = await response.json();
    setItems((current) => current.map((item) => (item.id === entryId ? { ...item, status: data.status ?? item.status } : item)));
    setFeedback((current) => ({ ...current, [entryId]: '' }));
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="atlas-card">
          <p className="font-semibold">{item.title}</p>
          <p className="mt-2 text-sm text-neutral-600">{getStatusLabel(item.status)}</p>
          <textarea
            value={feedback[item.id] ?? ''}
            onChange={(event) => setFeedback((current) => ({ ...current, [item.id]: event.target.value }))}
            placeholder="Commento editoriale"
            className="mt-3 min-h-24 w-full rounded-2xl border border-atlas-muted px-4 py-3 text-sm"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => (
              <button key={action.value} type="button" onClick={() => applyAction(item.id, action.value)} className="atlas-link-secondary">
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
