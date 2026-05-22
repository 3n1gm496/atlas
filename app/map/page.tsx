export const dynamic = 'force-dynamic';

import { LeafletMapExplorer } from '@/components/leaflet-map-explorer';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getCollectionDetail, getMapEntries } from '@/lib/services/public-content';
import { getI18n } from '@/lib/i18n/server';

export default async function MapPage({
  searchParams
}: {
  searchParams?: Promise<{ collection?: string }>;
}) {
  const { t } = getI18n();
  const resolvedSearchParams = (await searchParams) ?? {};
  const [entries, collection] = await Promise.all([
    getMapEntries(),
    resolvedSearchParams.collection ? getCollectionDetail(resolvedSearchParams.collection) : Promise.resolve(null)
  ]);
  const visibleEntries = collection ? entries.filter((entry) => collection.entries.some((item) => item.entryId === entry.id)) : entries;

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('nav.map')}
        title={collection ? t('mapPage.collectionTitle', { title: collection.title }) : t('mapPage.title')}
        description={
          collection
            ? t('mapPage.collectionDescription')
            : t('mapPage.description')
        }
        actions={[{ href: '/archive', label: t('nav.archive'), variant: 'secondary' }]}
      />

      {visibleEntries.length === 0 ? (
        <div className="atlas-empty">{t('mapPage.empty')}</div>
      ) : (
        <LeafletMapExplorer
          entries={visibleEntries.map((entry) => ({
            id: entry.id,
            slug: entry.slug,
            title: entry.title,
            abstract: entry.abstract,
            countryName: entry.countryName,
            placeName: entry.placeName,
            timePeriodLabel: entry.timePeriodLabel,
            featured: entry.featured,
            sheetRowNumber: entry.sheetRowNumber,
            sheetKey: entry.sheetKey,
            mediaAssetCount: entry.mediaAssetCount,
            mediaMatchStatus: entry.mediaMatchStatus,
            taxonomyTerms: entry.taxonomyTerms,
            taxonomyByGroup: entry.taxonomyByGroup,
            lat: entry.lat,
            lng: entry.lng
          }))}
        />
      )}
    </section>
  );
}
