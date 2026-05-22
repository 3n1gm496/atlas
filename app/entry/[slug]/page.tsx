export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PageIntentHeader } from '@/components/page-intent-header';
import { DatasetSheetTable } from '@/components/dataset-sheet-table';
import { toSheetColumns, type Cartel2SheetRow } from '@/lib/dataset/cartel2-sync';
import { getMediaMatchLabel, getMediaMatchedByLabel } from '@/lib/content/labels';
import { getI18n } from '@/lib/i18n/server';
import { getEntryDetailView } from '@/lib/services/public-content';

export default async function EntryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntryDetailView(slug);
  const { t, locale } = getI18n();

  if (!entry) return notFound();

  const metadata =
    entry.metadata && typeof entry.metadata === 'object' && !Array.isArray(entry.metadata)
      ? (entry.metadata as Record<string, unknown>)
      : null;
  const workbookRow =
    metadata && typeof metadata.sheet1 === 'object' && metadata.sheet1 && !Array.isArray(metadata.sheet1)
      ? toSheetColumns(metadata.sheet1 as Record<string, string>)
      : metadata && typeof metadata.workbookRow === 'object' && metadata.workbookRow && !Array.isArray(metadata.workbookRow)
        ? toSheetColumns(metadata.workbookRow as Record<string, string>)
        : null;
  const sourceNetwork =
    metadata && Array.isArray(metadata.sourceNetwork)
      ? (metadata.sourceNetwork as string[])
      : [];
  const sheetMeta =
    metadata && typeof metadata.sheet1 === 'object' && metadata.sheet1 && !Array.isArray(metadata.sheet1)
      ? (metadata.sheet1 as Record<string, unknown>)
      : null;
  const mediaMeta =
    sheetMeta && typeof sheetMeta.media === 'object' && sheetMeta.media && !Array.isArray(sheetMeta.media)
      ? (sheetMeta.media as Record<string, unknown>)
      : null;
  const sheetName = typeof sheetMeta?.sheetName === 'string' ? sheetMeta.sheetName : 'sheet1';
  const rowNumber =
    typeof sheetMeta?.rowNumber === 'string' || typeof sheetMeta?.rowNumber === 'number' ? sheetMeta.rowNumber : null;
  const rowNumberText = rowNumber === null || rowNumber === undefined ? '—' : String(rowNumber);
  const canonicalKey = typeof sheetMeta?.canonicalKey === 'string' ? sheetMeta.canonicalKey : workbookRow?.H ?? '—';
  const mediaMatch = typeof mediaMeta?.status === 'string' ? mediaMeta.status : entry.mediaAssets.length > 0 ? 'matched' : 'missing';
  const mediaMatchLabel = getMediaMatchLabel(mediaMatch, locale);
  const mediaMatchedByLabel = getMediaMatchedByLabel(typeof mediaMeta?.matchedBy === 'string' ? mediaMeta.matchedBy : null, locale);
  const groupedTaxonomy = Object.entries(entry.taxonomyByGroup).sort(([left], [right]) => left.localeCompare(right));

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('entry.eyebrow')}
        title={entry.title}
        description={entry.abstract}
        breadcrumb={t('entry.breadcrumb')}
        signalOverflowLabel={t('common.more')}
        signals={[
          { label: t('common.sheet'), value: sheetName },
          { label: t('common.row'), value: rowNumberText },
          { label: t('common.canonicalKey'), value: canonicalKey },
          {
            label: t('common.mediaMatch'),
            value: mediaMatchLabel,
            tone: mediaMatch === 'matched' ? 'success' : mediaMatch === 'partial' ? 'warning' : mediaMatch === 'missing' || mediaMatch === 'orphan' ? 'danger' : 'neutral'
          },
          { label: t('common.editorialFallback'), value: entry.editorialNote ? t('common.active') : t('common.inactive'), tone: entry.editorialNote ? 'warning' : 'neutral' }
        ]}
        actions={[
          { href: '/map', label: t('entry.actions.map'), variant: 'secondary' },
          { href: '/archive', label: t('entry.actions.archive') }
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section className="atlas-dark-card min-w-0 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="atlas-chip atlas-chip-active">{entry.countryName}</span>
            <span className="atlas-chip">{entry.canonicalLanguage}</span>
            {entry.editorialNote ? <span className="atlas-chip atlas-chip-warning">{t('common.editorialFallback')}</span> : null}
            {entry.taxonomy.slice(0, 5).map((term) => (
              <span key={term} className="atlas-chip atlas-chip-active">
                {term}
              </span>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
              <p className="atlas-meta">{t('entry.meta.author')}</p>
              <p className="mt-2 font-semibold text-white">{entry.contributorName}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
              <p className="atlas-meta">{t('entry.meta.country')}</p>
              <p className="mt-2 font-semibold text-white">{entry.countryName}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
              <p className="atlas-meta">{t('entry.meta.timeframe')}</p>
              <p className="mt-2 font-semibold text-white">{entry.timePeriodLabel ?? t('entry.meta.timeframeFallback')}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
              <p className="atlas-meta">{t('entry.meta.place')}</p>
              <p className="mt-2 font-semibold text-white">{entry.placeName ?? t('entry.meta.placeFallback')}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
              <p className="atlas-meta">{t('entry.meta.source')}</p>
              <p className="mt-2 font-semibold text-white">{entry.sourceContext ?? t('entry.meta.sourceFallback')}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
              <p className="atlas-meta">{t('entry.meta.metadata')}</p>
              <p className="mt-2 font-semibold text-white">{t('entry.meta.taxonomyCount', { count: entry.taxonomy.length })}</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="atlas-kicker">{t('entry.descriptionKicker')}</p>
            <p className="break-words text-sm leading-7 text-white/82">{entry.description}</p>
            {entry.editorialNote ? (
              <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
                <p className="atlas-meta text-white/72">{t('common.editorialFallback')}</p>
                <p className="mt-2 text-sm leading-6 text-white/84">{entry.editorialNote}</p>
              </div>
            ) : null}
          </div>
        </section>

        <div className="min-w-0 space-y-5">
          <section className="atlas-card min-w-0 space-y-4">
            <div>
              <p className="atlas-kicker">{t('entry.taxonomyKicker')}</p>
              <h2 className="atlas-section-title mt-2">{t('entry.taxonomyTitle')}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {entry.taxonomy.slice(0, 8).map((term) => <span key={term} className="atlas-chip atlas-chip-active">{term}</span>)}
            </div>
            <div className="grid gap-3">
              {groupedTaxonomy.map(([groupLabel, terms]) => (
                <article key={groupLabel} className="rounded-[1.2rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.68)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="atlas-meta break-words">{groupLabel}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {terms.map((term) => <span key={`${groupLabel}-${term}`} className="atlas-chip">{term}</span>)}
                      </div>
                    </div>
                    <span className="atlas-chip atlas-chip-active">{terms.length}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {entry.mediaAssets.length > 0 ? (
            <section className="atlas-card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="atlas-kicker">{t('common.media')}</p>
                  <h2 className="atlas-section-title mt-2">{t('common.mediaAssets', { count: entry.mediaAssets.length })}</h2>
                </div>
                <span className="atlas-chip">{entry.mediaAssets.length}</span>
              </div>
              <div className="grid gap-3">
                {entry.mediaAssets.slice(0, 4).map((asset) => (
                  <figure key={asset.id} className="overflow-hidden rounded-[1.4rem] border border-[rgba(112,83,61,0.14)] bg-[rgba(255,255,255,0.6)]">
                    {asset.kind === 'video' ? (
                      <video controls className="aspect-video w-full bg-black object-cover" src={asset.url} aria-label={asset.altText} />
                    ) : (
                      <Image
                        className="aspect-video w-full object-cover"
                        src={asset.url}
                        alt={asset.altText}
                        width={1200}
                        height={800}
                        unoptimized
                      />
                    )}
                    <figcaption className="px-4 py-3 text-sm text-[color:var(--atlas-ink-2)]">{asset.altText}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          <section className="atlas-card min-w-0 space-y-4">
            <div>
              <p className="atlas-kicker">{t('entry.meta.metadata')}</p>
              <h2 className="atlas-section-title mt-2">{t('common.sheet')}</h2>
            </div>
            {workbookRow ? (
              <DatasetSheetTable row={workbookRow as Cartel2SheetRow} caption={t('common.workbookRowCaption')} />
            ) : (
              <div className="atlas-empty">{t('common.sheet')}: {t('common.unavailable')}</div>
            )}
          </section>

          <section className="atlas-card min-w-0 space-y-4">
            <div>
              <p className="atlas-kicker">{t('entry.meta.source')}</p>
              <h2 className="atlas-section-title mt-2">{t('common.provenance')}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.15rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.68)] p-4">
                <p className="atlas-meta">{t('common.sheet')}</p>
                <p className="mt-2 text-sm font-medium text-[color:var(--atlas-ink-1)]">{sheetName}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.68)] p-4">
                <p className="atlas-meta">{t('common.row')}</p>
                <p className="mt-2 text-sm font-medium text-[color:var(--atlas-ink-1)]">{rowNumberText}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.68)] p-4">
                <p className="atlas-meta">{t('common.canonicalKey')}</p>
                <p className="mt-2 text-sm font-medium text-[color:var(--atlas-ink-1)]">{canonicalKey}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.68)] p-4">
                <p className="atlas-meta">{t('common.mediaMatch')}</p>
                <p className="mt-2 text-sm font-medium text-[color:var(--atlas-ink-1)]">{mediaMatchLabel}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm leading-6 text-[color:var(--atlas-ink-2)]">
              <p>
                {t('common.mediaAssets', { count: entry.mediaAssets.length })}: <strong>{entry.mediaAssets.length}</strong>
                {mediaMatchedByLabel ? ` · ${mediaMatchedByLabel}` : ''}
              </p>
              <p>
                {t('common.sourceNetwork')}: <strong>{sourceNetwork.length ? sourceNetwork.join(' · ') : workbookRow?.S ?? '—'}</strong>
              </p>
            </div>
            <div className="space-y-2">
              {entry.sourceLinks.length > 0 ? (
                <div className="space-y-2">
                  <p className="atlas-meta">{t('common.sourceLinks')}</p>
                  <ul className="space-y-2">
                    {entry.sourceLinks.map((link) => (
                      <li key={link.id}>
                        <a href={link.url} className="atlas-link-secondary break-all">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {entry.bibliographyItems.length > 0 ? (
                <div className="rounded-[1.2rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.68)] p-4 text-sm leading-6 text-[color:var(--atlas-ink-2)]">
                  <p className="atlas-meta mb-2">{t('common.bibliography')}</p>
                  {entry.bibliographyItems[0].citation}
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
