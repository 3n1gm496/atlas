export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function CollectionDetail({ params }: { params: { slug: string } }) {
  const collection = await prisma.collection.findUnique({ where: { slug: params.slug }, include: { sections: true, entries: { include: { entry: true } } } });
  if (!collection) return notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">{collection.title}</h1>
      <p>{collection.intro}</p>
      <h2 className="font-semibold">Percorso</h2>
      <ul className="list-disc pl-6">{collection.sections.sort((a,b)=>a.orderIndex-b.orderIndex).map((s)=><li key={s.id}>{s.title}</li>)}</ul>
    </section>
  );
}
