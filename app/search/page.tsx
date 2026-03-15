import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { demoEntries, getStatusLabel } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() ?? '';
  let entries: { id: string; slug: string; title: string; abstract: string; status: string; country?: { name: string } }[] = [];

  if (q) {
    try {
      entries = await prisma.entry.findMany({
        where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { abstract: { contains: q, mode: 'insensitive' } }] },
        take: 30,
        orderBy: { updatedAt: 'desc' },
        include: { country: true }
      });
    } catch {
      entries = demoEntries
        .filter((entry) => `${entry.title} ${entry.abstract}`.toLowerCase().includes(q.toLowerCase()))
        .map((entry) => ({
          id: entry.id,
          slug: entry.slug,
          title: entry.title,
          abstract: entry.abstract,
          status: entry.status,
          country: { name: entry.countryName }
        }));
    }
  }

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Ricerca</p>
        <h1 className="atlas-title">Interroga l archivio</h1>
        <p className="max-w-3xl text-sm text-neutral-700">
          Cerca per titolo o abstract e continua a ottenere risultati anche in modalita demo locale.
        </p>
      </div>
      <form className="atlas-card flex flex-col gap-2 sm:flex-row" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cerca per titolo o abstract..."
          className="w-full rounded-2xl border border-atlas-muted px-4 py-3"
        />
        <button className="atlas-link-primary">Cerca</button>
      </form>
      {q ? (
        <div className="space-y-2">
          <p className="text-sm text-neutral-600">Risultati per: {q}</p>
          {entries.map((e) => (
            <Link key={e.id} className="atlas-card block" href={`/entry/${e.slug}`}>
              <p className="font-semibold">{e.title}</p>
              <p className="mt-1 text-sm text-neutral-600">
                {e.country?.name ?? 'Territorio non definito'} · {getStatusLabel(e.status)}
              </p>
              <p className="mt-2 text-sm text-neutral-700">{e.abstract}</p>
            </Link>
          ))}
          {entries.length === 0 ? <div className="atlas-empty">Nessun risultato.</div> : null}
        </div>
      ) : null}
    </section>
  );
}
