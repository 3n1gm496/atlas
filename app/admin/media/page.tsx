import { prisma } from '@/lib/prisma';
import { MediaManager } from '@/components/admin/media-manager';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const media: Awaited<ReturnType<typeof prisma.mediaAsset.findMany>> = await prisma.mediaAsset.findMany({ orderBy: { id: 'desc' }, take: 50 }).catch(() => []);

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Asset registry</p>
        <h1 className="atlas-title">Media library</h1>
      </div>
      <MediaManager
        initialItems={media.map((item) => ({
          id: item.id,
          kind: item.kind,
          url: item.url,
          altText: item.altText,
          entryId: item.entryId
        }))}
      />
      {media.length === 0 ? <div className="atlas-empty">Nessun media asset disponibile.</div> : null}
    </section>
  );
}
