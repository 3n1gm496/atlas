import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export default function AboutPage() {
  const { t } = getI18n();

  return (
    <section className="space-y-6">
      <PageIntentHeader
        eyebrow={t('about.eyebrow')}
        title={t('about.title')}
        description={t('about.description')}
        actions={[{ href: '/map', label: t('nav.map') }]}
      />

      <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="atlas-dark-card space-y-4">
          <p className="atlas-kicker">{t('about.eyebrow')}</p>
          <h2 className="atlas-section-title text-4xl">{t('brand.baseline')}</h2>
          <p className="atlas-body">{t('about.body1')}</p>
        </section>

        <section className="atlas-card space-y-5">
          <p className="atlas-body text-base leading-7">{t('about.body2')}</p>
          <p className="atlas-body text-base leading-7">{t('about.body3')}</p>
        </section>
      </div>
    </section>
  );
}
