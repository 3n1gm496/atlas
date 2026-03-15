import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { fallbackGroups } from '@/lib/atlas-taxonomy';

export const dynamic = 'force-dynamic';

export default async function TaxonomyPage() {
  const groups = await prisma.taxonomyGroup.findMany({ orderBy: { slug: 'asc' } }).catch(() => fallbackGroups);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Esploratore tassonomie</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {groups.map((g) => (
          <Link key={g.id} href={`/taxonomy/${g.slug}`} className="atlas-card hover:bg-neutral-50">
            <h2 className="font-semibold">{g.labelIt}</h2>
            <p className="text-xs text-neutral-600">/{g.slug}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
