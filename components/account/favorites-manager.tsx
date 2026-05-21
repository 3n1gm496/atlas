'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/components/i18n-provider';

type FavoriteItem = {
  id: string;
  entryId: string;
  slug: string;
  title: string;
  abstract: string;
};

export function FavoritesManager({ initialItems }: { initialItems: FavoriteItem[] }) {
  const { t } = useI18n();
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState('');

  async function remove(entryId: string) {
    setItems((current) => current.filter((item) => item.entryId !== entryId));
    await fetch('/api/account/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId })
    });
    setStatus(t('accountFavorites.list.removed'));
  }

  return (
    <div className="space-y-3">
      {items.length > 0 ? (
        <div className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('accountFavorites.list.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('accountFavorites.list.title')}</h2>
          </div>
          <div className="atlas-metric-grid">
            <article className="atlas-metric-card">
              <p className="atlas-meta">{t('accountFavorites.list.count')}</p>
              <strong>{items.length}</strong>
            </article>
          </div>
        </div>
      ) : null}
      {items.map((item) => (
        <div key={item.id} className="atlas-result-card">
          <Link href={`/entry/${item.slug}`} className="block">
            <p className="font-[family-name:var(--font-atlas-display)] text-3xl font-semibold text-[color:var(--atlas-ink-1)]">{item.title}</p>
            <p className="mt-3 text-sm leading-6 text-[color:var(--atlas-ink-2)]">{item.abstract}</p>
          </Link>
          <button type="button" onClick={() => remove(item.entryId)} className="mt-4 text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)] underline">
            {t('accountFavorites.list.remove')}
          </button>
        </div>
      ))}
      {items.length === 0 ? <div className="atlas-empty">{t('accountFavorites.list.empty')}</div> : null}
      {status ? <p className="text-sm text-[color:var(--atlas-ink-2)]" aria-live="polite">{status}</p> : null}
    </div>
  );
}
