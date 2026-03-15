import { prisma } from '@/lib/prisma';
import { demoEntries } from '@/lib/demo-content';
import { ReviewBoard } from '@/components/review-board';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const queue: Awaited<ReturnType<typeof prisma.entry.findMany>> = await prisma.entry
    .findMany({ where: { status: { in: ['submitted', 'under_review', 'changes_requested'] } }, take: 40, orderBy: { updatedAt: 'desc' } })
    .catch(() =>
      demoEntries
        .filter((entry) => ['submitted', 'under_review', 'changes_requested'].includes(entry.status))
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
    );

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Review board</p>
        <h1 className="atlas-title">Coda revisione editoriale</h1>
        <p className="text-sm text-neutral-700">Priorita, stati e contenuti che richiedono intervento di editor o amministrazione.</p>
      </div>
      <div className="space-y-2">
        {queue.length === 0 ? <div className="atlas-empty">Nessuna entry in review.</div> : <ReviewBoard initialItems={queue.map((e) => ({ id: e.id, title: e.title, status: e.status, slug: e.slug }))} />}
      </div>
    </section>
  );
}
