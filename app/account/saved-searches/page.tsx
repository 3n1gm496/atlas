import { prisma } from '@/lib/prisma';
import { getDemoContributor } from '@/lib/demo-user';

export const dynamic = 'force-dynamic';

export default async function AccountSavedSearchesPage() {
  const user = await getDemoContributor();
  const searches: Awaited<ReturnType<typeof prisma.savedSearch.findMany>> = user
    ? await prisma.savedSearch.findMany({ where: { userId: user.id }, take: 50 }).catch(() => [])
    : [];

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Ricerche salvate</h1>
      <div className="space-y-2">
        {searches.map((s) => <div key={s.id} className="atlas-card text-sm">{s.label}</div>)}
        {searches.length === 0 ? <div className="atlas-card text-sm text-neutral-600">Nessuna ricerca salvata.</div> : null}
      </div>
    </section>
  );
}
