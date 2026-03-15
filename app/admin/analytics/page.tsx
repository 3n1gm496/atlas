import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const byStatus = await prisma.entry.groupBy({ by: ['status'], _count: { _all: true } }).catch(() => []);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Analytics</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {byStatus.map((row) => (
          <div key={row.status} className="atlas-card text-sm">
            {row.status}: <strong>{row._count._all}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
