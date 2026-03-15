import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { demoCollections } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

type CollectionWithEntries = Prisma.CollectionGetPayload<{ include: { entries: true } }>;

export default async function AdminCollectionsPage() {
  const collections: CollectionWithEntries[] = await prisma.collection
    .findMany({ include: { entries: true }, orderBy: { title: 'asc' } })
    .catch(() =>
      demoCollections.map((collection) => ({
        id: collection.id,
        slug: collection.slug,
        title: collection.title,
        intro: collection.intro,
        heroImage: null,
        entries: collection.entrySlugs.map((slug, index) => ({
          id: `${collection.id}-${slug}`,
          collectionId: collection.id,
          entryId: slug,
          orderIndex: index + 1
        })),
        sections: []
      })) as CollectionWithEntries[]
    );

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Curatorial stack</p>
        <h1 className="atlas-title">Gestione collezioni</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {collections.map((c) => (
          <div key={c.id} className="atlas-card text-sm">
            <p className="font-semibold">{c.title}</p>
            <p className="mt-2 text-neutral-700">{c.intro}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500">{c.entries.length} entry collegate</p>
          </div>
        ))}
      </div>
    </section>
  );
}
