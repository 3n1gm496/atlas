'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';

type TaxonomyGroup = {
  id: string;
  slug: string;
  labelIt: string;
  terms: { id: string; labelIt: string }[];
};

export function TaxonomyExplorer({ groups }: { groups: TaxonomyGroup[] }) {
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
      <aside className="atlas-card space-y-4">
        <div>
          <p className="atlas-kicker">Taxonomy browser</p>
          <h2 className="mt-2 text-2xl font-semibold">Gruppi e famiglie concettuali</h2>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cerca gruppo o termine..."
          className="rounded-2xl border border-atlas-muted px-4 py-3"
        />
        <div className="space-y-2">
          {filtered.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelected(group.slug)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                active?.slug === group.slug ? 'bg-neutral-900 text-white' : 'border border-atlas-muted bg-white'
              }`}
            >
              <span className="font-medium">{group.labelIt}</span>
              <span className="text-xs uppercase tracking-wide">{group.terms.length}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="atlas-card space-y-4">
        {active ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="atlas-kicker">Gruppo selezionato</p>
                <h2 className="text-2xl font-semibold">{active.labelIt}</h2>
              </div>
              <Link href={`/taxonomy/${active.slug}`} className="atlas-link-secondary text-center">
                Apri pagina dedicata
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {active.terms.map((term) => (
                <article key={term.id} className="rounded-2xl border border-atlas-muted bg-white p-4">
                  <p className="font-semibold">{term.labelIt}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-neutral-500">/{active.slug}</p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="atlas-empty">Nessun gruppo corrisponde alla ricerca.</div>
        )}
      </section>
    </div>
  );
}
