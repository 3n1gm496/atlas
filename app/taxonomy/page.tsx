import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { fallbackGroups } from '@/lib/atlas-taxonomy';
import { TaxonomyExplorer } from '@/components/taxonomy-explorer';

export const dynamic = 'force-dynamic';

export default async function TaxonomyPage() {
  const groups = await prisma.taxonomyGroup
    .findMany({ include: { terms: true }, orderBy: { slug: 'asc' } })
    .catch(() => fallbackGroups);

  return (
    <section className="space-y-5">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Schema concettuale</p>
        <h1 className="atlas-title">Esploratore tassonomie</h1>
        <p className="max-w-3xl text-sm text-neutral-700">
          Le tassonomie organizzano il corpus per tipologia, geografia, pratiche, tono e formati. Qui puoi navigare gruppi e termini in modo piu rapido e visivo.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {groups.slice(0, 3).map((g) => (
          <Link key={g.id} href={`/taxonomy/${g.slug}`} className="atlas-stat hover:bg-white">
            <h2 className="font-semibold">{g.labelIt}</h2>
            <p className="mt-2 text-xs text-neutral-600">/{g.slug}</p>
            <p className="mt-2 text-sm text-neutral-700">{g.terms.length} termini pronti da esplorare</p>
          </Link>
        ))}
      </div>
      <TaxonomyExplorer groups={groups.map((group) => ({ id: group.id, slug: group.slug, labelIt: group.labelIt, terms: group.terms.map((term) => ({ id: term.id, labelIt: term.labelIt })) }))} />
    </section>
  );
}
