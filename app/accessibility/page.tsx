import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export default function AccessibilityPage() {
  const { t } = getI18n();
  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('accessibility.eyebrow')}
        title={t('accessibility.title')}
        description={t('accessibility.description')}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <article className="atlas-feature-tile text-sm text-[color:var(--atlas-ink-2)]">
          <h2 className="font-[family-name:var(--font-atlas-display)] text-3xl font-semibold text-[color:var(--atlas-ink-1)]">{t('accessibility.items.baseline.title')}</h2>
          <p className="mt-3 leading-6">{t('accessibility.items.baseline.body')}</p>
        </article>
        <article className="atlas-dark-card text-sm">
          <h2 className="font-[family-name:var(--font-atlas-display)] text-3xl font-semibold text-white">{t('accessibility.items.inProgress.title')}</h2>
          <p className="mt-3 leading-6 text-white/80">{t('accessibility.items.inProgress.body')}</p>
        </article>
      </div>
    </section>
  );
}
