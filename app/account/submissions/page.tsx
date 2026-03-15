import { prisma } from '@/lib/prisma';
import { getDemoContributor } from '@/lib/demo-user';

export const dynamic = 'force-dynamic';

export default async function AccountSubmissionsPage() {
  const user = await getDemoContributor();
  const submissions: Awaited<ReturnType<typeof prisma.entry.findMany>> = user
    ? await prisma.entry.findMany({ where: { contributorId: user.id }, orderBy: { updatedAt: 'desc' }, take: 50 }).catch(() => [])
    : [];

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Storico submission</h1>
      <div className="space-y-2">{submissions.map((s) => <div key={s.id} className="atlas-card text-sm">{s.title} · {s.status}</div>)}</div>
    </section>
  );
}
