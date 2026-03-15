export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function TaxonomyGroupPage({ params }: { params: { group: string } }) {
  const group = await prisma.taxonomyGroup.findUnique({ where: { slug: params.group }, include: { terms: true } });
  if (!group) return notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{group.labelIt}</h1>
      <ul className="list-disc pl-6">{group.terms.map((term)=><li key={term.id}>{term.labelIt}</li>)}</ul>
    </section>
  );
}
