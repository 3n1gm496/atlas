import { DataTable } from '@/components/admin/data-table';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getAdminTaxonomies } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AdminTaxonomiesPage() {
  const groups = await getAdminTaxonomies();
  const totalTerms = groups.reduce((count, group) => count + group.terms.length, 0);
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('adminTaxonomies.eyebrow')}
        title={t('adminTaxonomies.title')}
        description={t('adminTaxonomies.description')}
        breadcrumb={t('adminTaxonomies.breadcrumb')}
      />
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="atlas-poster-panel space-y-5">
          <div className="space-y-3">
            <p className="atlas-kicker">{t('adminTaxonomies.hero.kicker')}</p>
            <h2 className="atlas-section-title text-5xl text-white">{t('adminTaxonomies.hero.title')}</h2>
            <p className="atlas-body max-w-2xl">{t('adminTaxonomies.hero.body')}</p>
          </div>
          <div className="atlas-stat-rail border-t border-white/10 pt-5">
            <article>
              <p className="atlas-meta">{t('adminTaxonomies.stats.groups')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{groups.length}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminTaxonomies.stats.terms')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{totalTerms}</p>
            </article>
          </div>
        </section>

        <section className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('adminTaxonomies.watch.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminTaxonomies.watch.title')}</h2>
          </div>
          <div className="atlas-plain-list">
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminTaxonomies.watch.item1.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminTaxonomies.watch.item1.body')}</p>
            </div>
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminTaxonomies.watch.item2.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminTaxonomies.watch.item2.body')}</p>
            </div>
          </div>
        </section>
      </div>
      <DataTable
        caption={t('adminTaxonomies.table.caption')}
        rows={groups}
        emptyMessage={t('adminTaxonomies.table.empty')}
        columns={[
          { key: 'labelIt', header: t('adminTaxonomies.table.group'), render: (g) => <span className="font-semibold">{g.labelIt}</span> },
          { key: 'slug', header: t('adminTaxonomies.table.slug'), render: (g) => `/${g.slug}` },
          { key: 'terms', header: t('adminTaxonomies.table.terms'), render: (g) => g.terms.length },
          { key: 'translations', header: t('adminTaxonomies.table.translations'), render: (g) => `${g.labelEn} · ${g.labelFr}` }
        ]}
      />
    </section>
  );
}
