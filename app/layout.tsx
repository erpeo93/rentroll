'use client';

import './globals.css';
import { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { I18nProvider } from '../lib/i18n';

export default function RootLayout({ children }: { children: ReactNode }) {
  const langParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null;
  const lang = langParam === 'it' ? 'it' : 'en';

  return (
    <html lang={lang}>
      <head />
      <body>
        <I18nProvider lang={lang}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}