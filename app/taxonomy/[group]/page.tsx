export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { fallbackGroups } from '@/lib/atlas-taxonomy';

type GroupModel = Prisma.TaxonomyGroupGetPayload<{ include: { terms: true } }>;

export default async function TaxonomyGroupPage({ params }: { params: { group: string } }) {
  let group: GroupModel | null = null;
  try {
    group = await prisma.taxonomyGroup.findUnique({ where: { slug: params.group }, include: { terms: true } });
  } catch {
    const fallback = fallbackGroups.find((item) => item.slug === params.group);
    if (!fallback) {
      return <section className="atlas-empty">Impossibile caricare la tassonomia.</section>;
    }

    return (
      <section className="space-y-4">
        <div className="atlas-card atlas-hero space-y-3">
          <p className="atlas-kicker">Gruppo tassonomico</p>
          <h1 className="atlas-title">{fallback.labelIt}</h1>
          <p className="text-sm text-neutral-700">Percorso demo locale per continuare a navigare il lessico curatoriale anche senza query database.</p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {fallback.terms.map((term) => (
            <li key={term.id} className="atlas-card">{term.labelIt}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (!group) return notFound();

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Gruppo tassonomico</p>
        <h1 className="atlas-title">{group.labelIt}</h1>
        <p className="text-sm text-neutral-700">{group.terms.length} termini disponibili per classificazione, ricerca e curatela.</p>
      </div>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {group.terms.map((term) => (
          <li key={term.id} className="atlas-card">{term.labelIt}</li>
        ))}
      </ul>
    </section>
  );
}
