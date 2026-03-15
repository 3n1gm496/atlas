import { prisma } from '@/lib/prisma';
import { demoEntries, demoUsers, getStatusLabel } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const byStatus = await prisma.entry.groupBy({ by: ['status'], _count: { _all: true } }).catch(() => {
    const counts = new Map<string, number>();
    for (const entry of demoEntries) counts.set(entry.status, (counts.get(entry.status) ?? 0) + 1);
    return Array.from(counts.entries()).map(([status, count]) => ({ status, _count: { _all: count } }));
  });
  const byCountry = await prisma.entry.groupBy({ by: ['countryId'], _count: { _all: true } }).catch(() => []);
  const totalEntries = byStatus.reduce((sum, row) => sum + row._count._all, 0);
  const published = byStatus.find((row) => row.status === 'published')?._count._all ?? 0;

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Control room</p>
        <h1 className="atlas-title">Analytics</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <article className="atlas-stat">
          <p className="text-sm text-neutral-600">Entry totali</p>
          <p className="mt-2 text-3xl font-semibold">{totalEntries}</p>
        </article>
        <article className="atlas-stat">
          <p className="text-sm text-neutral-600">Pubblicate</p>
          <p className="mt-2 text-3xl font-semibold">{published}</p>
        </article>
        <article className="atlas-stat">
          <p className="text-sm text-neutral-600">Ruoli attivi</p>
          <p className="mt-2 text-3xl font-semibold">{demoUsers.length}</p>
        </article>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {byStatus.map((row) => (
          <div key={row.status} className="atlas-card text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{getStatusLabel(row.status)}</span>
              <strong>{row._count._all}</strong>
            </div>
            <div className="mt-3 h-3 rounded-full bg-neutral-100">
              <div className="h-3 rounded-full bg-neutral-900" style={{ width: `${totalEntries ? (row._count._all / totalEntries) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="atlas-card text-sm text-neutral-700">
        Paesi coperti nel dataset attuale: {byCountry.length || new Set(demoEntries.map((entry) => entry.countryName)).size}
      </div>
    </section>
  );
}
