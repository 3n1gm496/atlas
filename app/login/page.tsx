'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/components/i18n-provider';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    setLoading(false);
    if (result?.error) {
      setError(t('auth.login.error'));
    } else {
      router.push('/account');
      router.refresh();
    }
  }

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

      <div className="atlas-card space-y-4">
        <div>
          <p className="atlas-kicker">{t('auth.login.form.kicker')}</p>
          <h2 className="atlas-section-title mt-2">{t('auth.login.form.title')}</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-3">
          {error ? <p className="rounded-[1.2rem] bg-[rgba(166,69,61,0.1)] px-4 py-3 text-sm text-[color:var(--atlas-danger)]" aria-live="polite">{error}</p> : null}
          <label className="grid gap-1 text-sm">
            <span>{t('auth.login.form.email')}</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              spellCheck={false}
              placeholder={t('auth.login.form.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="atlas-input"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>{t('auth.login.form.password')}</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder={t('auth.login.form.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="atlas-input"
            />
          </label>
          <button type="submit" disabled={loading} className="atlas-link-primary disabled:opacity-60">
            {loading ? t('auth.login.form.loading') : t('auth.login.form.submit')}
          </button>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--atlas-ink-3)]">
            <Link href="/forgot-password" className="underline">{t('auth.login.form.forgot')}</Link>
            <span>
              {t('auth.login.form.noAccount')}{' '}
              <Link href="/register" className="underline">{t('auth.login.form.register')}</Link>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
