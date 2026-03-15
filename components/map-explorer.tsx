'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { getCountryPosition, getStatusLabel } from '@/lib/demo-content';

type MapEntry = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  countryName: string;
  status: string;
  placeName?: string | null;
  timePeriodLabel?: string | null;
  featured?: boolean;
};

export function MapExplorer({ entries }: { entries: MapEntry[] }) {
  const [query, setQuery] = useState('');
  const [activeCountry, setActiveCountry] = useState<string>('all');
  const deferredQuery = useDeferredValue(query);

  const countries = useMemo(
    () => ['all', ...Array.from(new Set(entries.map((entry) => entry.countryName))).sort((a, b) => a.localeCompare(b))],
    [entries]
  );

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesCountry = activeCountry === 'all' || entry.countryName === activeCountry;
      const haystack = `${entry.title} ${entry.abstract} ${entry.placeName ?? ''}`.toLowerCase();
      const matchesQuery = haystack.includes(deferredQuery.trim().toLowerCase());
      return matchesCountry && matchesQuery;
    });
  }, [activeCountry, deferredQuery, entries]);

  const grouped = useMemo(() => {
    return countries
      .filter((country) => country !== 'all')
      .map((country) => {
        const countryEntries = filteredEntries.filter((entry) => entry.countryName === country);
        return { country, entries: countryEntries, point: getCountryPosition(country) };
      })
      .filter((group) => group.entries.length > 0);
  }, [countries, filteredEntries]);

  return (
    <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
      <aside className="atlas-card space-y-4">
        <div>
          <p className="atlas-kicker">Filtri geografici</p>
          <h2 className="mt-2 text-2xl font-semibold">Esplora i nodi territoriali</h2>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cerca luogo, titolo, abstract..."
          className="rounded-2xl border border-atlas-muted px-4 py-3"
        />
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => setActiveCountry(country)}
              className={`rounded-full px-3 py-2 text-sm transition ${
                activeCountry === country ? 'bg-neutral-900 text-white' : 'border border-atlas-muted bg-white text-neutral-700'
              }`}
            >
              {country === 'all' ? 'Tutti' : country}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filteredEntries.slice(0, 6).map((entry) => (
            <Link key={entry.id} href={`/entry/${entry.slug}`} className="block rounded-2xl border border-atlas-muted bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                {entry.countryName} · {entry.placeName ?? 'Nodo territoriale'}
              </p>
              <h3 className="mt-2 font-semibold">{entry.title}</h3>
              <p className="mt-2 text-sm text-neutral-700">{entry.abstract}</p>
              <p className="mt-3 text-xs text-neutral-500">{getStatusLabel(entry.status)}</p>
            </Link>
          ))}
          {filteredEntries.length === 0 ? <div className="atlas-empty">Nessuna entry corrisponde ai filtri.</div> : null}
        </div>
      </aside>

      <section className="atlas-card space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="atlas-kicker">Mediterranean graph</p>
            <h2 className="text-2xl font-semibold">Mappa interattiva</h2>
          </div>
          <p className="text-sm text-neutral-600">{filteredEntries.length} entry visibili</p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-atlas-muted bg-[#f7f1e8] p-4">
          <svg viewBox="0 0 560 320" className="h-[360px] w-full">
            <defs>
              <linearGradient id="atlasSea" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#dbe8ef" />
                <stop offset="100%" stopColor="#bfd2df" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="560" height="320" rx="32" fill="url(#atlasSea)" />
            <path
              d="M80 110C140 70 205 58 245 82C270 96 286 95 310 84C361 59 445 64 500 98L506 100L506 110C470 142 435 165 411 178C381 194 343 200 318 195C286 188 252 186 214 196C180 205 126 215 68 205L60 162C60 141 69 122 80 110Z"
              fill="#f5e4c7"
              stroke="#d1bfa2"
              strokeWidth="2"
            />
            <path
              d="M112 216C165 226 220 222 260 213C303 204 347 205 389 216C435 228 477 220 511 196L511 240C466 264 419 274 372 271C338 269 302 259 259 258C204 256 150 268 92 247Z"
              fill="#efd1aa"
              opacity="0.7"
            />
            {grouped.map((group) => (
              <g key={group.country}>
                <circle
                  cx={group.point.x}
                  cy={group.point.y}
                  r={12 + Math.min(group.entries.length * 2, 12)}
                  fill={activeCountry === 'all' || activeCountry === group.country ? '#171412' : '#7b4d2a'}
                  opacity="0.88"
                  className="cursor-pointer"
                  onClick={() => setActiveCountry(group.country)}
                />
                <circle cx={group.point.x} cy={group.point.y} r={26} fill="transparent" stroke="#fff" strokeOpacity="0.45" />
                <text x={group.point.x + 18} y={group.point.y + 5} fontSize="12" fill="#171412">
                  {group.country}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {grouped.slice(0, 3).map((group) => (
            <button
              key={group.country}
              type="button"
              onClick={() => setActiveCountry(group.country)}
              className="atlas-stat text-left"
            >
              <p className="text-sm text-neutral-600">{group.country}</p>
              <p className="mt-2 text-2xl font-semibold">{group.entries.length}</p>
              <p className="mt-2 text-sm text-neutral-700">
                {group.entries[0]?.timePeriodLabel ?? 'Periodo non definito'}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
