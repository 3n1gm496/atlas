import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { demoEntries, getStatusLabel } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

export default async function SubmitPage() {
  const contributor = await getCurrentUser();
  const drafts: Awaited<ReturnType<typeof prisma.entry.findMany>> = contributor
    ? await prisma.entry
        .findMany({ where: { contributorId: contributor.id }, orderBy: { updatedAt: 'desc' }, take: 30 })
        .catch(() =>
          demoEntries
            .filter((entry) => entry.contributorId === contributor.id)
            .map((entry) => ({
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
        )
    : [];

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Contributor workspace</p>
        <h1 className="atlas-title">Le tue submission</h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/submit/new" className="atlas-link-primary">Nuovo trend</Link>
          <Link href="/review" className="atlas-link-secondary">Apri review board</Link>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {drafts.map((e) => (
          <div key={e.id} className="atlas-card text-sm">
            <p className="font-semibold">{e.title}</p>
            <p className="mt-2 text-neutral-600">{getStatusLabel(e.status)}</p>
          </div>
        ))}
      </div>
      {drafts.length === 0 ? <div className="atlas-empty">Nessuna submission disponibile.</div> : null}
    </section>
  );
}
