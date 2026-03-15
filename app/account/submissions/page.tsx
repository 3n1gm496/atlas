import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { demoEntries, getStatusLabel } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

export default async function AccountSubmissionsPage() {
  const user = await getCurrentUser();
  const submissions: Awaited<ReturnType<typeof prisma.entry.findMany>> = user
    ? await prisma.entry
        .findMany({ where: { contributorId: user.id }, orderBy: { updatedAt: 'desc' }, take: 50 })
        .catch(() =>
          demoEntries
            .filter((entry) => entry.contributorId === user.id)
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
      <h1 className="atlas-title">Storico submission</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {submissions.map((s) => (
          <div key={s.id} className="atlas-card text-sm">
            <p className="font-semibold">{s.title}</p>
            <p className="mt-2 text-neutral-600">{getStatusLabel(s.status)}</p>
          </div>
        ))}
      </div>
      {submissions.length === 0 ? <div className="atlas-empty">Nessuna submission disponibile.</div> : null}
    </section>
  );
}
