import { headers } from 'next/headers';
import { LoginForm } from '@/components/login-form';
import { getI18n } from '@/lib/i18n/server';

export default async function LoginPage() {
  const { t } = getI18n();
  const headerList = await headers();
  const csrfToken = headerList.get('x-atlas-csrf-token') ?? '';

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="atlas-dark-card space-y-5">
        <p className="atlas-kicker">{t('auth.login.kicker')}</p>
        <h1 className="atlas-title text-6xl">{t('auth.login.title')}</h1>
        <p className="atlas-body">{t('auth.login.lead')}</p>
        <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-4 text-sm leading-6 text-white/78">
          {t('auth.login.notice')}
        </div>
      </div>

      <LoginForm csrfToken={csrfToken} />
    </section>
  );
}
