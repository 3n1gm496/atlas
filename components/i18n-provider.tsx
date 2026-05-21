'use client';

import { createContext, useContext, useMemo } from 'react';
import { defaultLocale, getMessage, messages, type Locale } from '@/lib/i18n/messages';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  setLocale: () => undefined,
  t: (key) => key
});

export function I18nProvider({
  children,
  locale,
  onLocaleChange
}: {
  children: React.ReactNode;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: onLocaleChange,
      t: (key, values) => getMessage(messages[locale], key, values)
    }),
    [locale, onLocaleChange]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

