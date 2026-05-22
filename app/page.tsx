import Link from 'next/link';
import { getPublicHomepageData } from '@/lib/services/public-content';
import { getMediaMatchLabel } from '@/lib/content/labels';
import { getI18n } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { t, locale } = getI18n();
  const { stats, featuredEntries } = await getPublicHomepageData();

  function mediaTone(status?: string | null) {
    switch (status) {
      case 'matched':
        return 'atlas-chip-success';
      case 'partial':
        return 'atlas-chip-warning';
      case 'missing':
      case 'orphan':
        return 'atlas-chip-danger';
      default:
        return '';
    }
  }

  return (
    <section className="space-y-10 overflow-x-clip">
      <section className="atlas-poster-panel overflow-hidden px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
          <div className="space-y-6">
            <span className="atlas-chip">{t('brand.baseline')}</span>
            <div className="space-y-5">
              <p className="atlas-kicker">{t('brand.name')}</p>
              <h1 className="atlas-title max-w-5xl text-white">{t('home.title')}</h1>
              <p className="atlas-lead max-w-3xl">{t('home.lead')}</p>
            </div>
            <div className="atlas-stat-rail border-t border-white/10 pt-5">
              <article>
                <p className="atlas-meta">{t('home.statsPublished')}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats.publishedCount}</p>
              </article>
              <article>
                <p className="atlas-meta">{t('home.statsPeople')}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats.usersCount}</p>
              </article>
              <article>
                <p className="atlas-meta">{t('home.statsCollections')}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats.collectionsCount}</p>
              </article>
            </div>
          </div>

          <div className="grid content-between gap-6">
            <div className="space-y-3">
              <p className="atlas-kicker">{t('home.entryLabel')}</p>
              <h2 className="atlas-section-title text-4xl text-white">{t('brand.subtitle')}</h2>
              <p className="atlas-body max-w-xl">{t('home.lead')}</p>
            </div>

            <div className="atlas-plain-list">
              {[
                [t('home.mapTitle'), t('home.mapDescription'), '/map'],
                [t('home.archiveTitle'), t('home.archiveDescription'), '/archive'],
                [t('home.collectionsTitle'), t('home.collectionsDescription'), '/collections']
              ].map(([title, text, href]) => (
              <Link key={title} href={href} className="atlas-plain-row text-white">
                <div className="flex min-w-0 items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <p className="font-[family-name:var(--font-atlas-display)] text-3xl font-semibold">{title}</p>
                    <p className="text-sm leading-6 text-white/74">{text}</p>
                  </div>
                    <span className="atlas-chip border-white/16 bg-white/10 text-white">{t('common.open')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
        <div className="atlas-dark-card space-y-5">
          <div>
            <p className="atlas-kicker">{t('home.whyKicker')}</p>
            <h2 className="atlas-section-title text-4xl">{t('home.whyTitle')}</h2>
          </div>
          <p className="atlas-body max-w-3xl">{t('home.whyBody')}</p>
        </div>

        <div className="atlas-card space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="atlas-kicker">{t('home.sectionLabel')}</p>
              <h2 className="atlas-section-title">{t('home.sectionTitle')}</h2>
            </div>
            <Link href="/archive" className="atlas-link-secondary">
              {t('home.openArchive')}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredEntries.slice(0, 4).map((entry, index) => (
              <Link key={entry.id} href={`/entry/${entry.slug}`} className={`${index === 0 ? 'atlas-feature-tile md:col-span-2' : 'atlas-result-card'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="atlas-meta">
                    {entry.countryName} · {entry.placeName ?? t('home.defaultPlace')}
                  </p>
                  {entry.editorialNote ? <span className="atlas-chip atlas-chip-warning">{t('common.editorialFallback')}</span> : null}
                  {entry.featured || index === 0 ? <span className="atlas-chip atlas-chip-active">{t('home.featured')}</span> : null}
                  {entry.mediaMatchStatus ? <span className={`atlas-chip ${mediaTone(entry.mediaMatchStatus)}`}>{getMediaMatchLabel(entry.mediaMatchStatus, locale)}</span> : null}
                </div>
                <h3 className="mt-3 font-[family-name:var(--font-atlas-display)] text-3xl font-semibold leading-tight text-[color:var(--atlas-ink-1)]">
                  {entry.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--atlas-ink-2)]">{entry.abstract}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="atlas-chip">{entry.sheetKey ?? t('common.sheet')}</span>
                  {entry.sheetRowNumber ? <span className="atlas-chip">{t('common.row')} {entry.sheetRowNumber}</span> : null}
                  <span className="atlas-chip">{t('common.mediaAssets', { count: entry.mediaAssetCount })}</span>
                  <p className="atlas-meta">{entry.timePeriodLabel ?? t('home.defaultPeriod')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
