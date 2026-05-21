import { getStatusLabel } from '@/lib/content/labels';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getAdminAnalytics } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const { byStatus, byCountry, userCount, totalEntries, published } = await getAdminAnalytics();
  const publicationRate = totalEntries ? Math.round((published / totalEntries) * 100) : 0;
  const coverageDepth = byCountry.length;
  const biggestStatus = byStatus[0];
  const topCountries = byCountry.slice(0, 5);
  const { t, locale } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('adminAnalytics.eyebrow')}
        title={t('adminAnalytics.title')}
        description={t('adminAnalytics.description')}
        breadcrumb={t('adminAnalytics.breadcrumb')}
      />
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="atlas-poster-panel space-y-5">
          <div className="space-y-3">
            <p className="atlas-kicker">{t('adminAnalytics.hero.kicker')}</p>
            <h2 className="atlas-section-title text-5xl text-white">{t('adminAnalytics.hero.title')}</h2>
            <p className="atlas-body max-w-2xl">{t('adminAnalytics.hero.body')}</p>
          </div>
          <div className="atlas-stat-rail border-t border-white/10 pt-5">
            <article>
              <p className="atlas-meta">{t('adminAnalytics.stats.total')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{totalEntries}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminAnalytics.stats.published')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{published}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminAnalytics.stats.activeUsers')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{userCount}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminAnalytics.stats.countries')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{coverageDepth}</p>
            </article>
          </div>
        </section>

        <section className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('adminAnalytics.quick.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminAnalytics.quick.title')}</h2>
          </div>
          <div className="atlas-metric-grid">
            <article className="atlas-metric-card">
              <p className="atlas-meta">{t('adminAnalytics.quick.publishRate')}</p>
              <strong>{publicationRate}%</strong>
            </article>
            <article className="atlas-metric-card">
              <p className="atlas-meta">{t('adminAnalytics.quick.busiest')}</p>
              <strong>{biggestStatus ? getStatusLabel(biggestStatus.status, locale) : t('adminAnalytics.quick.none')}</strong>
            </article>
          </div>
          <div className="atlas-plain-list">
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminAnalytics.quick.item1.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminAnalytics.quick.item1.body')}</p>
            </div>
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminAnalytics.quick.item2.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminAnalytics.quick.item2.body')}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
        <section className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('adminAnalytics.statuses.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminAnalytics.statuses.title')}</h2>
          </div>
          <div className="space-y-3">
            {byStatus.map((row, index) => (
              <div key={row.status} className={index === 0 ? 'atlas-dark-card text-sm' : 'atlas-card text-sm'}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-semibold ${index === 0 ? 'text-white' : 'text-[color:var(--atlas-ink-1)]'}`}>{getStatusLabel(row.status, locale)}</span>
                  <strong className={index === 0 ? 'text-white' : 'text-[color:var(--atlas-ink-1)]'}>{row._count._all}</strong>
                </div>
                <div className={`mt-3 h-3 rounded-full ${index === 0 ? 'bg-white/10' : 'bg-black/5'}`}>
                  <div
                    className={`h-3 rounded-full ${index === 0 ? 'bg-white' : 'bg-[color:var(--atlas-ink-1)]'}`}
                    style={{ width: `${totalEntries ? (row._count._all / totalEntries) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('adminAnalytics.coverage.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminAnalytics.coverage.title')}</h2>
          </div>
          {topCountries.length === 0 ? (
            <div className="atlas-empty">{t('adminAnalytics.coverage.empty')}</div>
          ) : (
            <div className="atlas-plain-list">
              {topCountries.map((row) => (
                <div key={row.countryId} className="atlas-plain-row">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[color:var(--atlas-ink-1)]">{row.countryName}</p>
                      <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminAnalytics.coverage.label')}</p>
                    </div>
                    <span className="atlas-chip atlas-chip-active">{row._count._all}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
