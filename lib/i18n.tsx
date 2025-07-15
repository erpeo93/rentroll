'use client';

import en from '../i18n/en.json';
import it from '../i18n/it.json';
import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type TranslationDict = {
  [key: string]: string;
};

const translations: Record<'en' | 'it', TranslationDict> = {
  en,
  it,
};

type Lang = 'en' | 'it';

const I18nContext = createContext<{
  t: (key: string) => string;
  language: Lang;
  toggleLanguage: () => void;
}>({
  t: (key: string) => key,
  language: 'en',
  toggleLanguage: () => {},
});

export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Lang>(lang);

  const t = (key: string): string => {
    return translations[currentLang][key] || key;
  };

  const toggleLanguage = useCallback(() => {
    const newLang = currentLang === 'en' ? 'it' : 'en';
    const params = new URLSearchParams(window.location.search);
    params.set('lang', newLang);
    window.location.search = params.toString(); // forces reload with new lang
  }, [currentLang]);

  return (
    <I18nContext.Provider value={{ t, language: currentLang, toggleLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useTranslation = () => useContext(I18nContext);