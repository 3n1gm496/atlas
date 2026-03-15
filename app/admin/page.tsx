import { prisma } from '@/lib/prisma';
import { demoCollections, demoEntries, demoUsers } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [entries, users, collections, taxonomies] = await Promise.all([
    prisma.entry.count().catch(() => demoEntries.length),
    prisma.user.count().catch(() => demoUsers.length),
    prisma.collection.count().catch(() => demoCollections.length),
    prisma.taxonomyTerm.count().catch(() => 0)
  ]);

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Governance</p>
        <h1 className="atlas-title">Admin dashboard</h1>
        <p className="text-sm text-neutral-700">
          Vista di controllo per monitorare contenuti, utenti, collezioni e tassonomie anche quando il database non e ancora pronto.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {[['Entries', entries], ['Utenti', users], ['Collezioni', collections], ['Termini tassonomici', taxonomies]].map(([k, v]) => (
          <article key={String(k)} className="atlas-stat"><p className="text-sm text-neutral-600">{k}</p><p className="text-2xl font-semibold">{v}</p></article>
        ))}
      </div>
    </section>
  );
}
