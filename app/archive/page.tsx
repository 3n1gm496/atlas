export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function ArchivePage() {
  const entries = await prisma.entry.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { country: true },
    take: 30
  });

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">Archivio</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded border bg-white p-4">
            <h2 className="font-semibold"><Link href={`/entry/${entry.slug}`}>{entry.title}</Link></h2>
            <p className="text-sm text-neutral-600">{entry.country.name} · {entry.status}</p>
            <p className="mt-2 text-sm">{entry.abstract}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
