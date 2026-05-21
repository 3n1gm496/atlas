'use client';

import { useTransition } from 'react';
import { localeCookieName, locales, type Locale } from '@/lib/i18n/messages';
import { useI18n } from '@/components/i18n-provider';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: Locale) {
    startTransition(() => {
      window.localStorage.setItem(localeCookieName, nextLocale);
      document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
      setLocale(nextLocale);
      window.location.reload();
    });
  }

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-[rgba(112,83,61,0.14)] bg-[rgba(255,252,248,0.72)] px-3 py-2 text-xs text-[color:var(--atlas-ink-2)]">
      <span className="hidden font-medium text-[color:var(--atlas-ink-1)] sm:inline">{t('language.label')}</span>
      <select
        aria-label={t('language.label')}
        value={locale}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value as Locale)}
        className="min-w-[5.25rem] bg-transparent text-[color:var(--atlas-ink-1)] outline-none"
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {t(`language.${item}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
