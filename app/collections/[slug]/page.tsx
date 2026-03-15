export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

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
    return <section className="atlas-card text-sm text-neutral-700">Impossibile caricare la collezione.</section>;
  }

  if (!collection) return notFound();

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">{collection.title}</h1>
      <p>{collection.intro}</p>
      <div className="atlas-card">
        <h2 className="font-semibold">Percorso</h2>
        <ul className="list-disc pl-6">
          {collection.sections
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((s) => (
              <li key={s.id}>{s.title}</li>
            ))}
        </ul>
      </div>
    </section>
  );
}
