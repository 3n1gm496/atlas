export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Collezioni curate</h1>
      {collections.map((collection)=><Link key={collection.id} href={`/collections/${collection.slug}`} className="block rounded border bg-white p-4">{collection.title}</Link>)}
    </section>
  );
}
