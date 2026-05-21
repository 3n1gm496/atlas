import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export default function VerifyEmailPage() {
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('auth.verify.eyebrow')}
        title={t('auth.verify.title')}
        description={t('auth.verify.description')}
      />
    </section>
  );
}
