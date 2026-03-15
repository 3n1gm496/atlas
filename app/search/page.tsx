import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() ?? '';
  const entries = q
    ? await prisma.entry.findMany({
        where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { abstract: { contains: q, mode: 'insensitive' } }] },
        take: 30,
        orderBy: { updatedAt: 'desc' }
      }).catch(() => [])
    : [];

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Ricerca archivio</h1>
      <form className="atlas-card flex gap-2" method="get">
        <input name="q" defaultValue={q} placeholder="Cerca per titolo o abstract..." className="w-full rounded border border-atlas-muted px-3 py-2" />
        <button className="rounded bg-neutral-900 px-4 py-2 text-white">Cerca</button>
      </form>
      {q ? (
        <div className="space-y-2">
          <p className="text-sm text-neutral-600">Risultati per: {q}</p>
          {entries.map((e) => (
            <Link key={e.id} className="atlas-card block" href={`/entry/${e.slug}`}>{e.title}</Link>
          ))}
          {entries.length === 0 ? <div className="atlas-card text-sm text-neutral-600">Nessun risultato.</div> : null}
        </div>
      ) : null}
    </section>
  );
}
