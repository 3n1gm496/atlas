'use client';

import Link from 'next/link';
import { useState } from 'react';

type FavoriteItem = {
  id: string;
  entryId: string;
  slug: string;
  title: string;
  abstract: string;
};

export function FavoritesManager({ initialItems }: { initialItems: FavoriteItem[] }) {
  const [items, setItems] = useState(initialItems);

  async function remove(entryId: string) {
    setItems((current) => current.filter((item) => item.entryId !== entryId));
    await fetch('/api/account/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId })
    });
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="atlas-card block">
          <Link href={`/entry/${item.slug}`} className="block">
            <p className="font-semibold">{item.title}</p>
            <p className="mt-2 text-sm text-neutral-700">{item.abstract}</p>
          </Link>
          <button onClick={() => remove(item.entryId)} className="mt-3 text-xs underline">
            Rimuovi dai preferiti
          </button>
        </div>
      ))}
      {items.length === 0 ? <div className="atlas-empty">Nessun preferito salvato.</div> : null}
    </div>
  );
}
