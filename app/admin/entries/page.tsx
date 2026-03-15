import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminEntriesPage() {
  const entries: Awaited<ReturnType<typeof prisma.entry.findMany>> = await prisma.entry.findMany({ orderBy: { updatedAt: 'desc' }, take: 50 }).catch(() => []);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Gestione entries</h1>
      {entries.map((e) => (
        <div key={e.id} className="atlas-card text-sm"><Link href={`/entry/${e.slug}`} className="font-semibold">{e.title}</Link> · {e.status}</div>
      ))}
    </section>
  );
}
