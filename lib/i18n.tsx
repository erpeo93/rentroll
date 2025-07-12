'use client';

import en from '../i18n/en.json';
import it from '../i18n/it.json';
import { createContext, useContext } from 'react';

const translations = { en, it };
type Lang = 'en' | 'it';

const I18nContext = createContext<{ t: (key: string) => string }>({
  t: (key: string) => key
});

export function I18nProvider({ lang, children }: { lang: Lang, children: React.ReactNode }) {
  const dict = translations[lang] || en;
  const t = (key: string) => dict[key] || key;
  return <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>;
}

export const useTranslation = () => useContext(I18nContext);