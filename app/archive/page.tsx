export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { demoEntries, getStatusLabel } from '@/lib/demo-content';

async function loadEntries() {
  try {
    const items = await prisma.entry.findMany({ orderBy: { updatedAt: 'desc' }, include: { country: true }, take: 30 });
    if (items.length) return items;
  } catch {
    // Fall through to curated demo content.
  }

  return demoEntries.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    abstract: entry.abstract,
    status: entry.status,
    country: { name: entry.countryName }
  }));
}

export default async function ArchivePage() {
  const entries = await loadEntries();

  return (
    <section className="space-y-5">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Archivio</p>
        <h1 className="atlas-title">Corpus navigabile delle entry</h1>
        <p className="max-w-3xl text-sm text-neutral-700">
          Ogni scheda connette territorio, pratiche, formato e tono editoriale. Se il database non e disponibile, l archivio resta navigabile con un corpus demo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => (
          <article key={entry.id} className="atlas-card flex h-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                {entry.country.name} · {getStatusLabel(entry.status)}
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                <Link href={`/entry/${entry.slug}`}>{entry.title}</Link>
              </h2>
              <p className="mt-3 text-sm text-neutral-700">{entry.abstract}</p>
            </div>
            <div className="mt-5">
              <Link href={`/entry/${entry.slug}`} className="text-sm font-medium underline">
                Apri la scheda
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
