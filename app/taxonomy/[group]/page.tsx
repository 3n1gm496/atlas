export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

type GroupModel = Prisma.TaxonomyGroupGetPayload<{ include: { terms: true } }>;

export default async function TaxonomyGroupPage({ params }: { params: { group: string } }) {
  let group: GroupModel | null = null;
  try {
    group = await prisma.taxonomyGroup.findUnique({ where: { slug: params.group }, include: { terms: true } });
  } catch {
    return <section className="atlas-card text-sm text-neutral-700">Impossibile caricare la tassonomia.</section>;
  }

  if (!group) return notFound();

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">{group.labelIt}</h1>
      <ul className="atlas-card list-disc pl-6">
        {group.terms.map((term) => (
          <li key={term.id}>{term.labelIt}</li>
        ))}
      </ul>
    </section>
  );
}
