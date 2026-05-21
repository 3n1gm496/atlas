'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { useI18n } from '@/components/i18n-provider';

type TaxonomyGroup = {
  id: string;
  slug: string;
  labelIt: string;
  terms: { id: string; labelIt: string }[];
};

export function TaxonomyExplorer({ groups }: { groups: TaxonomyGroup[] }) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string>(groups[0]?.slug ?? '');
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) return groups;
    return groups
      .map((group) => ({
        ...group,
        terms: group.terms.filter((term) => term.labelIt.toLowerCase().includes(normalized) || group.labelIt.toLowerCase().includes(normalized))
      }))
      .filter((group) => group.terms.length > 0 || group.labelIt.toLowerCase().includes(normalized));
  }, [deferredQuery, groups]);

  const active = filtered.find((group) => group.slug === selected) ?? filtered[0] ?? null;

  return (
    <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
      <aside className="atlas-card min-w-0 space-y-4">
        <div>
          <p className="atlas-kicker">{t('taxonomyExplorer.kicker')}</p>
          <h2 className="mt-2 break-words text-2xl font-semibold">{t('taxonomyExplorer.title')}</h2>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('taxonomyExplorer.placeholder')}
          className="w-full min-w-0 rounded-2xl border border-atlas-muted px-4 py-3"
        />
        <div className="space-y-2">
          {filtered.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelected(group.slug)}
              className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition ${
                active?.slug === group.slug ? 'bg-neutral-900 text-white' : 'border border-atlas-muted bg-white'
              }`}
            >
              <span className="min-w-0 break-words font-medium">{group.labelIt}</span>
              <span className="shrink-0 text-xs uppercase tracking-wide">{group.terms.length}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="atlas-card min-w-0 space-y-4">
        {active ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="atlas-kicker">{t('taxonomyExplorer.selected')}</p>
                <h2 className="break-words text-2xl font-semibold">{active.labelIt}</h2>
              </div>
              <Link href={`/taxonomy/${active.slug}`} className="atlas-link-secondary text-center">
                {t('taxonomyExplorer.openPage')}
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {active.terms.map((term) => (
                <article key={term.id} className="rounded-2xl border border-atlas-muted bg-white p-4">
                  <p className="break-words font-semibold">{term.labelIt}</p>
                  <p className="mt-2 break-all text-xs uppercase tracking-wide text-neutral-500">/{active.slug}</p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="atlas-empty">{t('taxonomyExplorer.empty')}</div>
        )}
      </section>
    </div>
  );
}
