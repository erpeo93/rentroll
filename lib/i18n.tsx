'use client';

import en from '../i18n/en.json';
import it from '../i18n/it.json';
import { createContext, useContext } from 'react';

// Allow t() to return either a string or a FAQ array
type TranslationDict = {
  [key: string]: string;
};

const translations: Record<'en' | 'it', TranslationDict> = {
  en,
  it
};

type Lang = 'en' | 'it';

// ✅ Update context type to support both return types
const I18nContext = createContext<{
  t: (key: string) => string;
}>({
  t: (key: string) => key
});

export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>;
}

export const useTranslation = () => useContext(I18nContext);