export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function loadEntries() {
  try {
    return await prisma.entry.findMany({ orderBy: { updatedAt: 'desc' }, include: { country: true }, take: 30 });
  } catch {
    return [];
  }
}

export default async function ArchivePage() {
  const entries = await loadEntries();

  return (
    <section className="space-y-5">
      <h1 className="atlas-title">Archivio</h1>
      {entries.length === 0 ? (
        <div className="atlas-card text-sm text-neutral-600">Nessuna entry disponibile: verifica connessione DB o seed.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <article key={entry.id} className="atlas-card">
              <h2 className="font-semibold">
                <Link href={`/entry/${entry.slug}`}>{entry.title}</Link>
              </h2>
              <p className="text-sm text-neutral-600">
                {entry.country.name} · {entry.status}
              </p>
              <p className="mt-2 text-sm">{entry.abstract}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
