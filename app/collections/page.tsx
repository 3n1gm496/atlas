export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getCollectionsIndex } from '@/lib/services/public-content';

export default async function CollectionsPage() {
  const collections = await getCollectionsIndex();
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('collectionsPage.eyebrow')}
        title={t('collectionsPage.title')}
        description={t('collectionsPage.description')}
        actions={[
          { href: '/archive', label: t('collectionsPage.actions.archive'), variant: 'secondary' },
          { href: '/map', label: t('collectionsPage.actions.map') }
        ]}
      />
      {collections.length === 0 ? (
        <div className="atlas-empty">{t('collectionsPage.empty')}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {collections.map((collection, index) => (
            <Link key={collection.id} href={`/collections/${collection.slug}`} className={index === 0 ? 'atlas-dark-card block' : 'atlas-result-card'}>
              <p className={`atlas-kicker ${index === 0 ? 'text-white/70' : ''}`}>{t('collectionsPage.cardKicker')}</p>
              <p className={`mt-3 font-[family-name:var(--font-atlas-display)] text-4xl font-semibold ${index === 0 ? 'text-white' : 'text-[color:var(--atlas-ink-1)]'}`}>
                {collection.title}
              </p>
              <p className={`mt-3 text-sm leading-6 ${index === 0 ? 'text-white/80' : 'text-[color:var(--atlas-ink-2)]'}`}>{collection.intro}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
