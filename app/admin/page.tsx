import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [entries, users, collections, taxonomies] = await Promise.all([
    prisma.entry.count().catch(() => 0),
    prisma.user.count().catch(() => 0),
    prisma.collection.count().catch(() => 0),
    prisma.taxonomyTerm.count().catch(() => 0)
  ]);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Admin dashboard</h1>
      <div className="grid gap-3 md:grid-cols-4">
        {[['Entries', entries], ['Utenti', users], ['Collezioni', collections], ['Termini tassonomici', taxonomies]].map(([k, v]) => (
          <article key={String(k)} className="atlas-card"><p className="text-sm text-neutral-600">{k}</p><p className="text-2xl font-semibold">{v}</p></article>
        ))}
      </div>
    </section>
  );
}
