import { defaultLocale, getMessage, locales, messages, type Locale } from './messages';

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function getServerLocale(): Locale {
  return defaultLocale;
}

export function getI18n(locale = getServerLocale()) {
  const dictionary = messages[locale];
  return {
    locale,
    messages: dictionary,
    t: (key: string, values?: Record<string, string | number>) => getMessage(dictionary, key, values)
  };
}
