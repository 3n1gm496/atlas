import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export default function PrivacyPage() {
  const { t } = getI18n();
  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('privacy.eyebrow')}
        title={t('privacy.title')}
        description={t('privacy.description')}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { title: t('privacy.items.collected.title'), body: t('privacy.items.collected.body') },
          { title: t('privacy.items.public.title'), body: t('privacy.items.public.body') },
          { title: t('privacy.items.requests.title'), body: t('privacy.items.requests.body') }
        ].map((item, index) => (
          <article key={item.title} className={`${index === 0 ? 'atlas-dark-card' : 'atlas-feature-tile'} min-w-0 text-sm`}>
            <h2
              className={`break-words font-[family-name:var(--font-atlas-display)] text-2xl font-semibold md:text-3xl ${
                index === 0 ? 'text-white' : 'text-[color:var(--atlas-ink-1)]'
              }`}
            >
              {item.title}
            </h2>
            <p className={`mt-3 break-words leading-6 ${index === 0 ? 'text-white/80' : 'text-[color:var(--atlas-ink-2)]'}`}>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
