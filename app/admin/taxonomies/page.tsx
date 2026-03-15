import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { fallbackGroups } from '@/lib/atlas-taxonomy';

export const dynamic = 'force-dynamic';

type GroupWithTerms = Prisma.TaxonomyGroupGetPayload<{ include: { terms: true } }>;

export default async function AdminTaxonomiesPage() {
  const groups: GroupWithTerms[] = await prisma.taxonomyGroup
    .findMany({ include: { terms: true }, orderBy: { slug: 'asc' } })
    .catch(() =>
      fallbackGroups.map((group) => ({
        id: group.id,
        slug: group.slug,
        labelIt: group.labelIt,
        labelEn: group.labelIt,
        labelFr: group.labelIt,
        terms: group.terms.map((term) => ({
          id: term.id,
          groupId: group.id,
          slug: term.id,
          labelIt: term.labelIt,
          labelEn: term.labelIt,
          labelFr: term.labelIt,
          aliases: []
        }))
      })) as GroupWithTerms[]
    );

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Taxonomy governance</p>
        <h1 className="atlas-title">Gestione tassonomie</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.id} className="atlas-card text-sm">
            <strong>{g.labelIt}</strong>
            <p className="mt-2 text-neutral-700">/{g.slug}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-neutral-500">{g.terms.length} termini</p>
          </div>
        ))}
      </div>
    </section>
  );
}
