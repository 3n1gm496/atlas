import { DataTable } from '@/components/admin/data-table';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getAdminCollections } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
  const collections = await getAdminCollections();
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('adminCollections.eyebrow')}
        title={t('adminCollections.title')}
        description={t('adminCollections.description')}
        breadcrumb={t('adminCollections.breadcrumb')}
      />
      <DataTable
        caption={t('adminCollections.table.caption')}
        rows={collections}
        emptyMessage={t('adminCollections.table.empty')}
        columns={[
          { key: 'title', header: t('adminCollections.table.collection'), render: (c) => <span className="font-semibold">{c.title}</span> },
          { key: 'intro', header: t('adminCollections.table.summary'), render: (c) => <span className="line-clamp-2">{c.intro}</span> },
          { key: 'entries', header: t('adminCollections.table.entries'), render: (c) => c.entries.length },
          { key: 'sections', header: t('adminCollections.table.sections'), render: (c) => c.sections.length }
        ]}
      />
    </section>
  );
}
