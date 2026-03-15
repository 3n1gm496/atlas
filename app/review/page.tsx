import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const queue: Awaited<ReturnType<typeof prisma.entry.findMany>> = await prisma.entry
    .findMany({ where: { status: { in: ['submitted', 'under_review', 'changes_requested'] } }, take: 40, orderBy: { updatedAt: 'desc' } })
    .catch(() => []);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Coda revisione editoriale</h1>
      <div className="space-y-2">
        {queue.map((e) => (
          <article key={e.id} className="atlas-card">
            <h2 className="font-semibold"><Link href={`/entry/${e.slug}`}>{e.title}</Link></h2>
            <p className="text-sm text-neutral-600">Stato: {e.status}</p>
          </article>
        ))}
        {queue.length === 0 ? <div className="atlas-card text-sm text-neutral-600">Nessuna entry in review.</div> : null}
      </div>
    </section>
  );
}
