import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getDemoContributor } from '@/lib/demo-user';

export const dynamic = 'force-dynamic';

export default async function SubmitPage() {
  const contributor = await getDemoContributor();
  const drafts: Awaited<ReturnType<typeof prisma.entry.findMany>> = contributor
    ? await prisma.entry.findMany({ where: { contributorId: contributor.id }, orderBy: { updatedAt: 'desc' }, take: 30 }).catch(() => [])
    : [];

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Le tue submission</h1>
      <Link href="/submit/new" className="inline-block rounded-full bg-neutral-900 px-4 py-2 text-white">Nuovo trend</Link>
      <div className="space-y-2">
        {drafts.map((e) => <div key={e.id} className="atlas-card text-sm">{e.title} · {e.status}</div>)}
        {drafts.length === 0 ? <div className="atlas-card text-sm text-neutral-600">Nessuna submission disponibile.</div> : null}
      </div>
    </section>
  );
}
