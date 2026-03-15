export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { demoEntries, findDemoCollectionBySlug } from '@/lib/demo-content';

type CollectionDetailModel = Prisma.CollectionGetPayload<{
  include: { sections: true; entries: { include: { entry: true } } };
}>;

export default async function CollectionDetail({ params }: { params: { slug: string } }) {
  let collection: CollectionDetailModel | null = null;
  try {
    collection = await prisma.collection.findUnique({
      where: { slug: params.slug },
      include: { sections: true, entries: { include: { entry: true } } }
    });
  } catch {
    const demoCollection = findDemoCollectionBySlug(params.slug);
    if (!demoCollection) {
      return <section className="atlas-empty">Impossibile caricare la collezione.</section>;
    }

    return (
      <section className="space-y-4">
        <div className="atlas-card atlas-hero space-y-3">
          <p className="atlas-kicker">Percorso curatoriale</p>
          <h1 className="atlas-title">{demoCollection.title}</h1>
          <p className="text-sm text-neutral-700">{demoCollection.intro}</p>
        </div>
        <div className="atlas-card">
          <h2 className="font-semibold">Percorso</h2>
          <ul className="mt-3 space-y-3">
            {demoCollection.sections
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((section) => (
                <li key={section.id} className="rounded-2xl border border-atlas-muted bg-white p-4">
                  <p className="font-semibold">{section.title}</p>
                  <p className="mt-2 text-sm text-neutral-700">{section.content}</p>
                </li>
              ))}
          </ul>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {demoEntries
            .filter((entry) => demoCollection.entrySlugs.includes(entry.slug))
            .map((entry) => (
              <Link key={entry.id} href={`/entry/${entry.slug}`} className="atlas-card block">
                <p className="font-semibold">{entry.title}</p>
                <p className="mt-2 text-sm text-neutral-700">{entry.abstract}</p>
              </Link>
            ))}
        </div>
      </section>
    );
  }

  if (!collection) return notFound();

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Percorso curatoriale</p>
        <h1 className="atlas-title">{collection.title}</h1>
        <p>{collection.intro}</p>
      </div>
      <div className="atlas-card">
        <h2 className="font-semibold">Percorso</h2>
        <ul className="mt-3 space-y-3">
          {collection.sections
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((s) => (
              <li key={s.id} className="rounded-2xl border border-atlas-muted bg-white p-4">{s.title}</li>
            ))}
        </ul>
      </div>
    </section>
  );
}
