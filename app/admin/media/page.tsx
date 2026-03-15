import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const media = await prisma.mediaAsset.findMany({ orderBy: { id: 'desc' }, take: 50 }).catch(() => []);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Media library</h1>
      {media.map((m) => <div key={m.id} className="atlas-card text-sm">{m.kind} · {m.url}</div>)}
    </section>
  );
}
