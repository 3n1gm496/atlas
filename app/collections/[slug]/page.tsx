export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getCollectionDetail } from '@/lib/services/public-content';
import { getI18n } from '@/lib/i18n/server';

export default async function CollectionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = getI18n();
  const { slug } = await params;
  const collection = await getCollectionDetail(slug);

  if (!collection) return notFound();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('nav.collections')}
        title={collection.title}
        description={collection.intro}
        breadcrumb={`${t('nav.explore')} / ${t('nav.collections')}`}
        actions={[
          { href: '/collections', label: t('collectionsPage.detail.back'), variant: 'secondary' },
          { href: `/map?collection=${collection.slug}`, label: t('collectionsPage.detail.openMap') }
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="atlas-dark-card space-y-4">
          <p className="atlas-kicker">{t('collectionsPage.detail.path')}</p>
          <div className="space-y-3">
            {collection.sections.map((section, index) => (
              <article key={section.id} className={`rounded-[1.5rem] border px-4 py-4 ${index === 0 ? 'border-white/18 bg-white/10' : 'border-white/10 bg-black/10'}`}>
                <p className="font-[family-name:var(--font-atlas-display)] text-3xl font-semibold text-white">{section.title}</p>
                <p className="mt-3 text-sm leading-6 text-white/80">{section.content}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="atlas-kicker">{t('collectionsPage.detail.connected')}</p>
              <h2 className="atlas-section-title">{t('collectionsPage.detail.chainTitle')}</h2>
            </div>
            <span className="atlas-chip">{t('collectionsPage.detail.cardsCount', { count: collection.entries.length })}</span>
          </div>
          <div className="atlas-card space-y-4">
            <div className="space-y-3">
              {collection.entries.map((item, index) => (
                <div key={item.id} className="relative">
                  {index < collection.entries.length - 1 ? <span className="absolute left-5 top-[4.5rem] h-10 w-px bg-[rgba(112,83,61,0.18)]" aria-hidden="true" /> : null}
                  <Link href={`/entry/${item.entry.slug}`} className="atlas-plain-row">
                    <div className="flex items-start gap-4">
                      <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(112,83,61,0.08)] text-sm font-semibold text-[color:var(--atlas-ink-2)]">
                        {index + 1}
                      </span>
                      <div className="space-y-2">
                        <p className="atlas-meta">{item.entry.country.name}</p>
                        <p className="text-xl font-semibold leading-tight text-[color:var(--atlas-ink-1)]">{item.entry.title}</p>
                        <p className="text-sm leading-6 text-[color:var(--atlas-ink-2)]">{item.entry.abstract}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
