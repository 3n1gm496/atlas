'use client';

import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { I18nProvider } from '@/components/i18n-provider';
import { localeCookieName, type Locale } from '@/lib/i18n/messages';

export function Providers({
  children,
  locale
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const [activeLocale, setActiveLocale] = useState(() => {
    if (typeof window === 'undefined') {
      return locale;
    }

    const storedLocale = window.localStorage.getItem(localeCookieName) as Locale | null;
    return storedLocale && storedLocale !== locale ? storedLocale : locale;
  });

  useEffect(() => {
    if (activeLocale !== locale) {
      document.cookie = `${localeCookieName}=${activeLocale}; path=/; max-age=31536000; samesite=lax`;
    }
  }, [activeLocale, locale]);

  return (
    <SessionProvider>
      <I18nProvider locale={activeLocale} onLocaleChange={setActiveLocale}>
        {children}
      </I18nProvider>
    </SessionProvider>
  );
}
