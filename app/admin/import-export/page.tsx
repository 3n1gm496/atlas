import { ExportPanel } from '@/components/admin/export-panel';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getAdminOverview, getDatasetSyncOverview } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AdminImportExportPage() {
  const overview = await getAdminOverview();
  const syncOverview = getDatasetSyncOverview();
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('adminExport.eyebrow')}
        title={t('adminExport.title')}
        description={t('adminExport.description')}
        breadcrumb={t('adminExport.breadcrumb')}
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
              <p className="atlas-meta">Sheet rows</p>
              <p className="mt-2 text-3xl font-semibold text-white">{syncOverview.rowsTotal}</p>
            </article>
            <article>
              <p className="atlas-meta">Media matched</p>
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
            <p className="atlas-meta">Sync coverage</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">Rows without media</p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.rowsWithoutMedia}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">Orphan assets</p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.orphanAssets}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">Canonical collisions</p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.rowsWithCanonicalCollision}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">Matched assets</p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.matchedAssets} / {syncOverview.assetsTotal}</p>
              </div>
            </div>
            <div className="mt-4 rounded-[1rem] border border-[rgba(112,83,61,0.12)] bg-white/70 p-4">
              <p className="atlas-meta">Core metadata completeness</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">Rows complete on A/B/E/H</p>
                  <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.rowsWithCoreMetadata} / {syncOverview.rowsTotal}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">Coverage</p>
                  <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.coreMetadataCoverage}%</p>
                </div>
              </div>
              {syncOverview.coreMetadataMissingRowNumbers.length > 0 ? (
                <p className="mt-3 text-sm text-[color:var(--atlas-ink-2)]">
                  Incomplete rows: {syncOverview.coreMetadataMissingRowNumbers.join(', ')}
                </p>
              ) : null}
            </div>
            <div className="mt-4 rounded-[1rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.76)] p-4">
              <p className="atlas-meta">Editorial fallback coverage</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">Rows renderable with fallback</p>
                  <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.rowsRenderableWithEditorialFallback} / {syncOverview.rowsTotal}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)]">Coverage</p>
                  <p className="mt-1 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{syncOverview.editorialFallbackCoverage}%</p>
                </div>
              </div>
              {syncOverview.editorialFallbackMissingRowNumbers.length > 0 ? (
                <p className="mt-3 text-sm text-[color:var(--atlas-ink-2)]">
                  Missing editorial fallback: {syncOverview.editorialFallbackMissingRowNumbers.join(', ')}
                </p>
              ) : (
                <p className="mt-3 text-sm text-[color:var(--atlas-ink-2)]">
                  All sparse workbook rows now have a curated editorial fallback for public rendering.
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
