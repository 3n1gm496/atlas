export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getArchiveEntries, getArchiveFilterOptions } from '@/lib/services/public-content';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

type SearchParams = { q?: string; country?: string; taxonomy?: string; keyword?: string; year?: string; view?: string };

function buildQueryString(searchParams: SearchParams, overrides: Partial<SearchParams>) {
  const next = new URLSearchParams();
  const merged = { ...searchParams, ...overrides };
  Object.entries(merged).forEach(([key, value]) => {
    if (value) next.set(key, value);
  });
  return next.toString();
}

export default async function ArchivePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const { t } = getI18n();
  const [entries, filterOptions] = await Promise.all([getArchiveEntries(resolvedSearchParams), getArchiveFilterOptions()]);
  const countries = filterOptions.countries;
  const activeView = resolvedSearchParams.view === 'list' ? 'list' : 'grid';

  const activeFilters = [
    resolvedSearchParams.q ? { label: t('archive.queryFilter', { value: resolvedSearchParams.q }), href: `/archive?${buildQueryString(resolvedSearchParams, { q: undefined })}` } : null,
    resolvedSearchParams.country ? { label: t('archive.countryFilter', { value: resolvedSearchParams.country }), href: `/archive?${buildQueryString(resolvedSearchParams, { country: undefined })}` } : null,
    resolvedSearchParams.year ? { label: t('archive.yearFilter', { value: resolvedSearchParams.year }), href: `/archive?${buildQueryString(resolvedSearchParams, { year: undefined })}` } : null,
    resolvedSearchParams.taxonomy ? { label: t('archive.taxonomyFilter', { value: resolvedSearchParams.taxonomy }), href: `/archive?${buildQueryString(resolvedSearchParams, { taxonomy: undefined })}` } : null,
    resolvedSearchParams.keyword ? { label: t('archive.keywordFilter', { value: resolvedSearchParams.keyword }), href: `/archive?${buildQueryString(resolvedSearchParams, { keyword: undefined })}` } : null
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('archive.eyebrow')}
        title={t('archive.title')}
        description={t('archive.description')}
        actions={[{ href: '/map', label: t('nav.map'), variant: 'secondary' }]}
      />

      <form className="atlas-filter-bar grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_auto_auto]" method="get">
        <label className="sr-only" htmlFor="archive-q">
          {t('archive.title')}
        </label>
        <input id="archive-q" name="q" defaultValue={resolvedSearchParams.q ?? ''} placeholder={t('archive.searchPlaceholder')} className="atlas-input" />
        <select name="country" defaultValue={resolvedSearchParams.country ?? ''} className="atlas-select" aria-label={t('archive.filtersCountry')}>
          <option value="">{t('common.allCountries')}</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <input name="taxonomy" defaultValue={resolvedSearchParams.taxonomy ?? ''} className="atlas-input" placeholder={t('archive.filtersTaxonomy')} aria-label={t('archive.filtersTaxonomy')} />
        <input name="keyword" defaultValue={resolvedSearchParams.keyword ?? ''} className="atlas-input" placeholder={t('archive.filtersKeywords')} aria-label={t('archive.filtersKeywords')} />
        <input name="year" defaultValue={resolvedSearchParams.year ?? ''} className="atlas-input" placeholder={t('archive.filtersYear')} aria-label={t('archive.filtersYear')} />
        <input type="hidden" name="view" value={activeView} />
        <button className="atlas-link-primary" type="submit">
          {t('archive.apply')}
        </button>
        <Link href="/archive" className="atlas-link-secondary">
          {t('archive.reset')}
        </Link>
      </form>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="atlas-action-strip">
          {activeFilters.length > 0 ? (
            activeFilters.map((filter) => (
              <Link key={filter.label} href={filter.href} className="atlas-chip atlas-chip-active">
                {filter.label} · {t('common.remove').toLowerCase()}
              </Link>
            ))
          ) : (
            <span className="atlas-chip">{t('common.noFilters')}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="atlas-meta">{t('archive.resultCount', { count: entries.length })}</span>
          <Link href={`/archive?${buildQueryString(resolvedSearchParams, { view: 'grid' })}`} className={`atlas-chip ${activeView === 'grid' ? 'atlas-chip-active' : ''}`}>
            {t('archive.grid')}
          </Link>
          <Link href={`/archive?${buildQueryString(resolvedSearchParams, { view: 'list' })}`} className={`atlas-chip ${activeView === 'list' ? 'atlas-chip-active' : ''}`}>
            {t('archive.list')}
          </Link>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="atlas-empty">{t('archive.empty')}</div>
      ) : activeView === 'list' ? (
        <div className="atlas-card">
          {entries.map((entry) => (
            <Link key={entry.id} href={`/entry/${entry.slug}`} className="atlas-plain-row">
              <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="atlas-badge-status">{entry.countryName}</span>
                    {entry.editorialNote ? <span className="atlas-chip">Editorial fallback</span> : null}
                    {entry.featured ? <span className="atlas-chip atlas-chip-active">{t('archive.featured')}</span> : null}
                    {entry.sheetKey ? <span className="atlas-chip">{entry.sheetKey}</span> : null}
                    {entry.sheetRowNumber ? <span className="atlas-chip">riga {entry.sheetRowNumber}</span> : null}
                    <span className="atlas-chip">{entry.mediaAssetCount} media</span>
                  </div>
                  <h2 className="text-xl font-semibold text-[color:var(--atlas-ink-1)]">{entry.title}</h2>
                  <p className="max-w-3xl text-sm leading-6 text-[color:var(--atlas-ink-2)]">{entry.abstract}</p>
                  {entry.taxonomyByGroup ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(entry.taxonomyByGroup).slice(0, 3).map(([group, terms]) => (
                        <span key={`${entry.id}-${group}`} className="atlas-chip">
                          {group} · {terms.length}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {entry.taxonomyTerms?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {entry.taxonomyTerms.slice(0, 8).map((term) => (
                        <span key={`${entry.id}-${term}`} className="atlas-chip">
                          {term}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="min-w-44 space-y-2 lg:text-right">
                  <p className="atlas-meta">{entry.placeName ?? t('common.countryUndefined')}</p>
                  <p className="text-sm text-[color:var(--atlas-ink-2)]">{entry.timePeriodLabel ?? t('common.periodUndefined')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <Link key={entry.id} href={`/entry/${entry.slug}`} className={entry.featured ? 'atlas-feature-tile md:col-span-2' : 'atlas-result-card'}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="atlas-badge-status">{entry.countryName}</span>
                {entry.editorialNote ? <span className="atlas-chip">Editorial fallback</span> : null}
                {entry.featured ? <span className="atlas-chip atlas-chip-active">{t('archive.featured')}</span> : null}
                {entry.sheetKey ? <span className="atlas-chip">{entry.sheetKey}</span> : null}
                {entry.sheetRowNumber ? <span className="atlas-chip">riga {entry.sheetRowNumber}</span> : null}
                <span className="atlas-chip">{entry.mediaAssetCount} media</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-[color:var(--atlas-ink-1)]">{entry.title}</h2>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-[color:var(--atlas-ink-2)]">{entry.abstract}</p>
              {entry.taxonomyByGroup ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(entry.taxonomyByGroup).slice(0, 2).map(([group, terms]) => (
                    <span key={`${entry.id}-${group}`} className="atlas-chip">
                      {group} · {terms.length}
                    </span>
                  ))}
                </div>
              ) : null}
              {entry.taxonomyTerms?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.taxonomyTerms.slice(0, 6).map((term) => (
                    <span key={`${entry.id}-${term}`} className="atlas-chip">
                      {term}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="mt-4 atlas-meta">
                {entry.placeName ?? t('common.countryUndefined')} · {entry.timePeriodLabel ?? t('common.periodUndefined')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
