export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { demoEntries, getStatusLabel } from '@/lib/demo-content';

async function loadPublishedEntries() {
  try {
    const items = await prisma.entry.findMany({
      where: { status: 'published' },
      include: { country: true },
      take: 100,
      orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }]
    });
    if (items.length) return items;
  } catch {
    // Fall through to demo entries.
  }

  return demoEntries
    .filter((entry) => entry.status === 'published')
    .map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      abstract: entry.abstract,
      featured: entry.featured,
      status: entry.status,
      country: { name: entry.countryName },
      timePeriodLabel: entry.timePeriodLabel,
      placeName: entry.placeName
    }));
}

export default async function MapPage() {
  const entries = await loadPublishedEntries();

  const byCountry = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.country.name] = (acc[entry.country.name] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      <header className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Mappa dinamica</p>
        <h1 className="text-3xl font-semibold">Geografie culturali pronte da leggere</h1>
        <p className="max-w-3xl text-sm text-neutral-700">
          Vista aggregata per territorio, pronta per una futura mappa interattiva ma gia utile anche in formato editoriale e responsivo.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="atlas-empty">Nessun dato disponibile al momento.</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(byCountry).map(([country, count]) => (
              <div key={country} className="atlas-stat">
                <p className="text-sm text-neutral-600">{country}</p>
                <p className="text-2xl font-semibold">{count}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {entries.map((entry) => (
              <article key={entry.id} className="atlas-card">
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  {entry.country.name} · {entry.placeName ?? 'Nodo territoriale'} · {getStatusLabel(entry.status)}
                </p>
                <h2 className="font-semibold">
                  <Link href={`/entry/${entry.slug}`}>{entry.title}</Link>
                </h2>
                <p className="mt-2 text-sm text-neutral-700 line-clamp-2">{entry.abstract}</p>
                <p className="mt-3 text-xs text-neutral-500">{entry.timePeriodLabel ?? 'Periodo in definizione'}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
