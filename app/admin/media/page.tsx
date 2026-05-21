import { MediaManager } from '@/components/admin/media-manager';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getMediaLibrary } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const { media, entries } = await getMediaLibrary();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow="Admin / Media"
        title="Media library"
        description="Manage imported dataset assets and manual editorial media."
        breadcrumb="Admin / Media"
      />
      <MediaManager
        initialItems={media.map((item) => ({
          id: item.id,
          kind: item.kind,
          url: item.url,
          altText: item.altText,
          entryId: item.entryId
        }))}
        entryOptions={entries.map((entry) => ({ id: entry.id, label: entry.title }))}
      />
    </section>
  );
}
