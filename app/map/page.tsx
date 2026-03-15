export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function loadPublishedEntries() {
  try {
    return await prisma.entry.findMany({
      where: { status: 'published' },
      include: { country: true },
      take: 100,
      orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }]
    });
  } catch {
    return [];
  }
}

export default async function MapPage() {
  const entries = await loadPublishedEntries();

  const byCountry = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.country.name] = (acc[entry.country.name] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Mappa dinamica</h1>
        <p className="max-w-3xl text-sm text-neutral-700">
          Vista aggregata per geografia con accesso rapido alle entry pubblicate. In produzione questa sezione è pronta
          per essere collegata a Leaflet/MapLibre mantenendo gli stessi filtri server-side.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-6 text-sm text-neutral-600">
          Nessun dato disponibile al momento (database non connesso o nessuna entry pubblicata).
        </div>
      ) : (
        <>
          <div className="grid gap-4 rounded-lg border bg-white p-4 md:grid-cols-3">
            {Object.entries(byCountry).map(([country, count]) => (
              <div key={country} className="rounded-md border border-atlas-muted p-3">
                <p className="text-sm text-neutral-600">{country}</p>
                <p className="text-2xl font-semibold">{count}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-500">{entry.country.name}</p>
                <h2 className="font-semibold">
                  <Link href={`/entry/${entry.slug}`}>{entry.title}</Link>
                </h2>
                <p className="mt-2 text-sm text-neutral-700 line-clamp-2">{entry.abstract}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
