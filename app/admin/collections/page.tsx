import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type CollectionWithEntries = Prisma.CollectionGetPayload<{ include: { entries: true } }>;

export default async function AdminCollectionsPage() {
  const collections: CollectionWithEntries[] = await prisma.collection
    .findMany({ include: { entries: true }, orderBy: { title: 'asc' } })
    .catch(() => []);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Gestione collezioni</h1>
      {collections.map((c) => (
        <div key={c.id} className="atlas-card text-sm">
          {c.title} · {c.entries.length} entries
        </div>
      ))}
    </section>
  );
}
