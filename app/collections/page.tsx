export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function CollectionsPage() {
  let collections: Awaited<ReturnType<typeof prisma.collection.findMany>> = [];
  try {
    collections = await prisma.collection.findMany();
  } catch {
    collections = [];
  }

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Collezioni curate</h1>
      {collections.length === 0 ? (
        <div className="atlas-card text-sm text-neutral-600">Nessuna collezione disponibile.</div>
      ) : (
        collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.slug}`} className="atlas-card block hover:bg-neutral-50">
            {collection.title}
          </Link>
        ))
      )}
    </section>
  );
}
