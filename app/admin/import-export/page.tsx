import { ExportPanel } from '@/components/admin/export-panel';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getAdminOverview, getDatasetSyncOverview } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AdminImportExportPage() {
  const overview = await getAdminOverview();
  const syncOverview = getDatasetSyncOverview();
  const { t } = getI18n();
  const mediaCoverage = syncOverview.assetsTotal > 0 ? Math.round((syncOverview.matchedAssets / syncOverview.assetsTotal) * 100) : 0;

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('adminExport.eyebrow')}
        title={t('adminExport.title')}
        description={t('adminExport.description')}
        breadcrumb={t('adminExport.breadcrumb')}
        signals={[
          { label: t('adminExport.stats.records'), value: String(overview.entries) },
          { label: t('adminExport.stats.terms'), value: String(overview.taxonomyTerms) },
          { label: t('common.sheet'), value: String(syncOverview.rowsTotal) },
          { label: t('adminExport.syncCoverage.coverage'), value: `${mediaCoverage}%`, tone: mediaCoverage >= 90 ? 'success' : mediaCoverage >= 60 ? 'warning' : 'danger' },
          { label: t('common.editorialFallback'), value: `${syncOverview.rowsRenderableWithEditorialFallback}/${syncOverview.rowsTotal}` }
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="atlas-poster-panel min-w-0 space-y-5">
          <div className="space-y-3">
            <p className="atlas-kicker">{t('adminExport.hero.kicker')}</p>
            <h2 className="atlas-section-title text-5xl text-white">{t('adminExport.hero.title')}</h2>
            <p className="atlas-body max-w-2xl">{t('adminExport.hero.body')}</p>
          </div>
          <div className="atlas-stat-rail border-t border-white/10 pt-5">
            <article>
              <p className="atlas-meta">{t('adminExport.stats.records')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview.entries}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminExport.stats.terms')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overview.taxonomyTerms}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('common.sheet')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{syncOverview.rowsTotal}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminExport.syncCoverage.matchedAssets')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{syncOverview.matchedAssets}</p>
            </article>
          </div>
        </section>
        <section className="atlas-section-shell min-w-0 space-y-4 text-sm leading-6 text-[color:var(--atlas-ink-2)]">
          <div>
            <p className="atlas-kicker">{t('adminExport.when.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminExport.when.title')}</h2>
          </div>
          <div className="atlas-plain-list">
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminExport.when.item1.title')}</p>
              <p>{t('adminExport.when.item1.body')}</p>
            </div>
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminExport.when.item2.title')}</p>
              <p>{t('adminExport.when.item2.body')}</p>
            </div>
          </div>
          <div className="rounded-[1.4rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.72)] p-4">
            <p className="atlas-meta">{t('adminExport.syncCoverage.title')}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">{t('adminExport.syncCoverage.rowsWithoutMedia')}</p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.rowsWithoutMedia}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">{t('adminExport.syncCoverage.orphanAssets')}</p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.orphanAssets}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">{t('adminExport.syncCoverage.canonicalCollisions')}</p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.rowsWithCanonicalCollision}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">{t('adminExport.syncCoverage.matchedAssets')}</p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.matchedAssets} / {syncOverview.assetsTotal}</p>
              </div>
            </div>
            <div className="mt-4 rounded-[1rem] border border-[rgba(112,83,61,0.12)] bg-white/70 p-4">
              <p className="atlas-meta">{t('adminExport.syncCoverage.coreMetadata')}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">{t('adminExport.syncCoverage.completeRows')}</p>
                  <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.rowsWithCoreMetadata} / {syncOverview.rowsTotal}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">{t('adminExport.syncCoverage.coverage')}</p>
                  <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.coreMetadataCoverage}%</p>
                </div>
              </div>
              {syncOverview.coreMetadataMissingRowNumbers.length > 0 ? (
                <p className="mt-3 text-sm text-[color:var(--atlas-ink-2)]">
                  {t('adminExport.syncCoverage.incompleteRows')}: {syncOverview.coreMetadataMissingRowNumbers.join(', ')}
                </p>
              ) : null}
            </div>
            <div className="mt-4 rounded-[1rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.76)] p-4">
              <p className="atlas-meta">{t('adminExport.syncCoverage.editorialFallback')}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">{t('adminExport.syncCoverage.renderableRows')}</p>
                  <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.rowsRenderableWithEditorialFallback} / {syncOverview.rowsTotal}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">{t('adminExport.syncCoverage.coverage')}</p>
                  <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.editorialFallbackCoverage}%</p>
                </div>
              </div>
              {syncOverview.editorialFallbackMissingRowNumbers.length > 0 ? (
                <p className="mt-3 text-sm text-[color:var(--atlas-ink-2)]">
                  {t('adminExport.syncCoverage.missingFallback')}: {syncOverview.editorialFallbackMissingRowNumbers.join(', ')}
                </p>
              ) : (
                <p className="mt-3 text-sm text-[color:var(--atlas-ink-2)]">
                  {t('adminExport.syncCoverage.allFallback')}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
      <ExportPanel />
    </section>
  );
}
