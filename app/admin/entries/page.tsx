import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { demoEntries, getStatusLabel } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

export default async function AdminEntriesPage() {
  const entries: Awaited<ReturnType<typeof prisma.entry.findMany>> = await prisma.entry
    .findMany({ orderBy: { updatedAt: 'desc' }, take: 50 })
    .catch(() =>
      demoEntries.map((entry) => ({
        id: entry.id,
        slug: entry.slug,
        title: entry.title,
        status: entry.status,
        abstract: entry.abstract,
        description: entry.description,
        countryId: 'demo-country',
        contributorId: entry.contributorId,
        canonicalLanguage: entry.canonicalLanguage,
        visibility: 'public',
        featured: entry.featured,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as Awaited<ReturnType<typeof prisma.entry.findMany>>
    );

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Gestione entries</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {entries.map((e) => (
          <div key={e.id} className="atlas-card text-sm">
            <Link href={`/entry/${e.slug}`} className="font-semibold">{e.title}</Link>
            <p className="mt-2 text-neutral-600">{getStatusLabel(e.status)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
