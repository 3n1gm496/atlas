import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type GroupWithTerms = Prisma.TaxonomyGroupGetPayload<{ include: { terms: true } }>;

export default async function AdminTaxonomiesPage() {
  const groups: GroupWithTerms[] = await prisma.taxonomyGroup
    .findMany({ include: { terms: true }, orderBy: { slug: 'asc' } })
    .catch(() => []);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Gestione tassonomie</h1>
      {groups.map((g) => (
        <div key={g.id} className="atlas-card text-sm">
          <strong>{g.labelIt}</strong> · {g.terms.length} termini
        </div>
      ))}
    </section>
  );
}
