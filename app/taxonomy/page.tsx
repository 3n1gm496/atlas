import Link from 'next/link';
import { TaxonomyExplorer } from '@/components/taxonomy-explorer';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getTaxonomyGroups } from '@/lib/services/public-content';
import { getI18n } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function TaxonomyPage() {
  const { t } = getI18n();
  const groups = await getTaxonomyGroups();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('taxonomy.eyebrow')}
        title={t('taxonomy.title')}
        description={t('taxonomy.description')}
        actions={[{ href: '/archive', label: t('nav.archive'), variant: 'secondary' }]}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.slice(0, 3).map((group, index) => (
          <Link key={group.id} href={`/taxonomy/${group.slug}`} className={`${index === 0 ? 'atlas-dark-card block' : 'atlas-feature-tile'} min-w-0`}>
            <p className={`break-words font-[family-name:var(--font-atlas-display)] text-3xl font-semibold md:text-4xl ${index === 0 ? 'text-white' : 'text-[color:var(--atlas-ink-1)]'}`}>{group.labelIt}</p>
            <p className={`mt-2 break-all text-xs uppercase tracking-[0.16em] ${index === 0 ? 'text-white/60' : 'text-[color:var(--atlas-ink-3)]'}`}>/{group.slug}</p>
            <p className={`mt-3 break-words text-sm leading-6 ${index === 0 ? 'text-white/80' : 'text-[color:var(--atlas-ink-2)]'}`}>{t('taxonomy.readyTerms', { count: group.terms.length })}</p>
          </Link>
        ))}
      </div>
      <TaxonomyExplorer groups={groups.map((group) => ({ id: group.id, slug: group.slug, labelIt: group.labelIt, terms: group.terms.map((term) => ({ id: term.id, labelIt: term.labelIt })) }))} />
    </section>
  );
}
