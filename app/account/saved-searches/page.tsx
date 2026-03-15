import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { demoSavedSearches } from '@/lib/demo-content';
import { SavedSearchesManager } from '@/components/account/saved-searches-manager';

export const dynamic = 'force-dynamic';

export default async function AccountSavedSearchesPage() {
  const user = await getCurrentUser();
  const searches: Awaited<ReturnType<typeof prisma.savedSearch.findMany>> = user
    ? await prisma.savedSearch
        .findMany({ where: { userId: user.id }, take: 50 })
        .catch(() =>
          demoSavedSearches
            .filter((search) => search.userId === user.id)
            .map((search) => ({
              id: search.id,
              label: search.label,
              query: { summary: search.summary },
              userId: user.id
            })) as Awaited<ReturnType<typeof prisma.savedSearch.findMany>>
        )
    : [];

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Shortcuts di ricerca</p>
        <h1 className="atlas-title">Ricerche salvate</h1>
      </div>
      <SavedSearchesManager
        initialItems={searches.map((s) => ({
          id: s.id,
          label: s.label,
          summary: typeof s.query === 'object' && s.query && 'summary' in s.query ? String(s.query.summary) : 'Query salvata pronta da rilanciare.'
        }))}
      />
      <div className="atlas-card text-sm text-neutral-700">
        Suggerimento: usa queste ricerche come preset di lavoro per review, scouting territoriale o preparazione di collezioni curate.
      </div>
    </section>
  );
}
