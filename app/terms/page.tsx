import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export default function TermsPage() {
  const { t } = getI18n();
  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('terms.eyebrow')}
        title={t('terms.title')}
        description={t('terms.description')}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: t('terms.items.contributions.title'), body: t('terms.items.contributions.body') },
          { title: t('terms.items.moderation.title'), body: t('terms.items.moderation.body') },
          { title: t('terms.items.reuse.title'), body: t('terms.items.reuse.body') }
        ].map((item, index) => (
          <article key={item.title} className={index === 1 ? 'atlas-dark-card text-sm' : 'atlas-feature-tile text-sm'}>
            <h2 className={`font-[family-name:var(--font-atlas-display)] text-3xl font-semibold ${index === 1 ? 'text-white' : 'text-[color:var(--atlas-ink-1)]'}`}>{item.title}</h2>
            <p className={`mt-3 leading-6 ${index === 1 ? 'text-white/80' : 'text-[color:var(--atlas-ink-2)]'}`}>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
