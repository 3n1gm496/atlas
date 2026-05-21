import Link from 'next/link';
import { getStatusLabel } from '@/lib/content/labels';
import { DataTable } from '@/components/admin/data-table';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getAdminEntries } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AdminEntriesPage() {
  const entries = await getAdminEntries();
  const drafts = entries.filter((entry) => entry.status === 'draft').length;
  const submitted = entries.filter((entry) => ['submitted', 'under_review'].includes(entry.status)).length;
  const { t, locale } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('adminEntries.eyebrow')}
        title={t('adminEntries.title')}
        description={t('adminEntries.description')}
        breadcrumb={t('adminEntries.breadcrumb')}
      />
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="atlas-poster-panel space-y-5">
          <div className="space-y-3">
            <p className="atlas-kicker">{t('adminEntries.hero.kicker')}</p>
            <h2 className="atlas-section-title text-5xl text-white">{t('adminEntries.hero.title')}</h2>
            <p className="atlas-body max-w-2xl">{t('adminEntries.hero.body')}</p>
          </div>
          <div className="atlas-stat-rail border-t border-white/10 pt-5">
            <article>
              <p className="atlas-meta">{t('adminEntries.stats.visible')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{entries.length}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminEntries.stats.drafts')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{drafts}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminEntries.stats.inProgress')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{submitted}</p>
            </article>
          </div>
        </section>

        <section className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('adminEntries.scope.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminEntries.scope.title')}</h2>
          </div>
          <div className="atlas-plain-list">
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminEntries.scope.direct.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminEntries.scope.direct.body')}</p>
            </div>
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminEntries.scope.media.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminEntries.scope.media.body')}</p>
            </div>
          </div>
        </section>
      </div>
      <DataTable
        caption={t('adminEntries.table.caption')}
        rows={entries}
        emptyMessage={t('adminEntries.table.empty')}
        columns={[
          { key: 'title', header: t('adminEntries.table.card'), render: (e) => <Link href={`/entry/${e.slug}`} className="font-semibold underline">{e.title}</Link> },
          { key: 'status', header: t('adminEntries.table.status'), render: (e) => getStatusLabel(e.status, locale) },
          { key: 'country', header: t('adminEntries.table.country'), render: (e) => e.country.name },
          { key: 'contributor', header: t('adminEntries.table.contributor'), render: (e) => e.contributor.displayName },
          { key: 'updatedAt', header: t('adminEntries.table.updated'), render: (e) => e.updatedAt.toLocaleDateString(locale) }
        ]}
      />
    </section>
  );
}
