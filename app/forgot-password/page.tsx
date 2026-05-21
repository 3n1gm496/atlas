import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export default function ForgotPasswordPage() {
  const { t } = getI18n();
  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('auth.forgot.eyebrow')}
        title={t('auth.forgot.title')}
        description={t('auth.forgot.description')}
      />
      <form className="atlas-card grid max-w-xl gap-3">
        <input type="email" placeholder={t('auth.forgot.emailPlaceholder')} className="atlas-input" />
        <button type="button" className="atlas-link-primary">{t('auth.forgot.submit')}</button>
      </form>
    </section>
  );
}
