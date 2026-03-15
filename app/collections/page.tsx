export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { demoCollections } from '@/lib/demo-content';

export default async function CollectionsPage() {
  let collections: { id: string; slug: string; title: string; intro: string }[] = [];
  try {
    collections = await prisma.collection.findMany();
  } catch {
    collections = demoCollections.map((collection) => ({
      id: collection.id,
      slug: collection.slug,
      title: collection.title,
      intro: collection.intro
    }));
  }

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Curatela</p>
        <h1 className="atlas-title">Collezioni curate</h1>
        <p className="text-sm text-neutral-700">Percorsi editoriali che connettono piu entry in una lettura tematica o geografica.</p>
      </div>
      {collections.length === 0 ? (
        <div className="atlas-empty">Nessuna collezione disponibile.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.slug}`} className="atlas-card block hover:bg-neutral-50">
              <p className="font-semibold">{collection.title}</p>
              <p className="mt-2 text-sm text-neutral-700">{collection.intro}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
