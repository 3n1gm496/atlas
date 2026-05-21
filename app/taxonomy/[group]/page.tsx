export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getTaxonomyGroup } from '@/lib/services/public-content';
import { getI18n } from '@/lib/i18n/server';

export default async function TaxonomyGroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { t } = getI18n();
  const { group } = await params;
  const taxonomyGroup = await getTaxonomyGroup(group);

  if (!taxonomyGroup) return notFound();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('taxonomy.eyebrow')}
        title={taxonomyGroup.labelIt}
        description={t('taxonomy.groupDescription', { count: taxonomyGroup.terms.length })}
        breadcrumb={`${t('nav.explore')} / ${t('nav.taxonomies')}`}
        actions={[
          { href: '/taxonomy', label: t('taxonomy.backToTaxonomies'), variant: 'secondary' }
        ]}
      />
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {taxonomyGroup.terms.map((term, index) => (
          <li key={term.id} className={`${index === 0 ? 'atlas-dark-card' : 'atlas-result-card'} min-w-0`}>
            <span className={`block break-words font-[family-name:var(--font-atlas-display)] text-2xl font-semibold md:text-3xl ${index === 0 ? 'text-white' : 'text-[color:var(--atlas-ink-1)]'}`}>{term.labelIt}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
