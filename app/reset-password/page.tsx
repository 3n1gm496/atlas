import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export default function ResetPasswordPage() {
  const { t } = getI18n();
  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('auth.reset.eyebrow')}
        title={t('auth.reset.title')}
        description={t('auth.reset.description')}
      />
      <form className="atlas-dark-card grid max-w-xl gap-3">
        <input type="password" placeholder={t('auth.reset.newPassword')} className="atlas-input" />
        <input type="password" placeholder={t('auth.reset.confirmPassword')} className="atlas-input" />
        <button type="button" className="atlas-link-primary">{t('auth.reset.submit')}</button>
      </form>
    </section>
  );
}
