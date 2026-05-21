'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/components/i18n-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? t('auth.register.error'));
      } else {
        router.push('/login?registered=1');
      }
    } catch {
      setError(t('auth.register.network'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="atlas-card space-y-5">
        <p className="atlas-kicker">{t('auth.register.kicker')}</p>
        <h1 className="atlas-title">{t('auth.register.title')}</h1>
        <p className="atlas-lead">{t('auth.register.lead')}</p>
      </div>
      <form onSubmit={handleSubmit} className="atlas-dark-card grid gap-4">
        {error ? <p className="rounded-[1.2rem] bg-white/8 px-4 py-3 text-sm text-[#ffd2cd]">{error}</p> : null}
        <label className="grid gap-1 text-sm text-white/84">
          <span>{t('auth.register.form.displayName')}</span>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required minLength={2} className="atlas-input" />
        </label>
        <label className="grid gap-1 text-sm text-white/84">
          <span>{t('auth.register.form.email')}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="atlas-input" />
        </label>
        <label className="grid gap-1 text-sm text-white/84">
          <span>{t('auth.register.form.password')}</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="atlas-input" />
        </label>
        <button type="submit" disabled={loading} className="atlas-link-primary disabled:opacity-60">
          {loading ? t('auth.register.form.loading') : t('auth.register.form.submit')}
        </button>
        <p className="text-xs text-white/62">
          {t('auth.register.form.hasAccount')}{' '}
          <Link href="/login" className="underline">{t('auth.register.form.signIn')}</Link>
        </p>
      </form>
    </section>
  );
}
