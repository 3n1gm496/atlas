export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { demoEntries, getStatusLabel } from '@/lib/demo-content';

async function loadEntries(filters: { q?: string; country?: string; status?: string }) {
  try {
    const items = await prisma.entry.findMany({
      where: {
        ...(filters.q
          ? {
              OR: [
                { title: { contains: filters.q, mode: 'insensitive' } },
                { abstract: { contains: filters.q, mode: 'insensitive' } },
                { description: { contains: filters.q, mode: 'insensitive' } }
              ]
            }
          : {}),
        ...(filters.country ? { country: { name: { equals: filters.country, mode: 'insensitive' } } } : {}),
        ...(filters.status ? { status: filters.status as never } : {})
      },
      orderBy: { updatedAt: 'desc' },
      include: { country: true },
      take: 30
    });
    if (items.length) return items;
  } catch {
    // Fall through to curated demo content.
  }

  return demoEntries
    .filter((entry) => {
      const matchesQ = filters.q ? `${entry.title} ${entry.abstract}`.toLowerCase().includes(filters.q.toLowerCase()) : true;
      const matchesCountry = filters.country ? entry.countryName === filters.country : true;
      const matchesStatus = filters.status ? entry.status === filters.status : true;
      return matchesQ && matchesCountry && matchesStatus;
    })
    .map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      abstract: entry.abstract,
      status: entry.status,
      country: { name: entry.countryName }
    }));
}

export default async function ArchivePage({ searchParams }: { searchParams: { q?: string; country?: string; status?: string } }) {
  const entries = await loadEntries(searchParams);
  const countries = Array.from(new Set(entries.map((entry) => entry.country.name))).sort((a, b) => a.localeCompare(b));

  return (
    <section className="space-y-5">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Archivio</p>
        <h1 className="atlas-title">Corpus navigabile delle entry</h1>
        <p className="max-w-3xl text-sm text-neutral-700">
          Ogni scheda connette territorio, pratiche, formato e tono editoriale. Se il database non e disponibile, l archivio resta navigabile con un corpus demo.
        </p>
      </div>

      <form className="atlas-card grid gap-3 md:grid-cols-4" method="get">
        <input name="q" defaultValue={searchParams.q ?? ''} placeholder="Cerca nel corpus..." className="rounded-2xl border border-atlas-muted px-4 py-3 md:col-span-2" />
        <select name="country" defaultValue={searchParams.country ?? ''} className="rounded-2xl border border-atlas-muted px-4 py-3">
          <option value="">Tutti i paesi</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <select name="status" defaultValue={searchParams.status ?? ''} className="rounded-2xl border border-atlas-muted px-4 py-3">
          <option value="">Tutti gli stati</option>
          <option value="draft">Bozza</option>
          <option value="submitted">Sottomessa</option>
          <option value="under_review">In revisione</option>
          <option value="changes_requested">Revisioni richieste</option>
          <option value="approved">Approvata</option>
          <option value="published">Pubblicata</option>
        </select>
        <button className="atlas-link-primary w-fit" type="submit">Filtra</button>
      </form>

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
