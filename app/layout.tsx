'use client';

import './globals.css';
import { ReactNode, useState } from 'react';
import { I18nProvider } from '../lib/i18n';
import { CartProvider } from '@/lib/cart-context';
import CheckoutModal from '@/components/modal/CheckoutModal';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const lang = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('lang') === 'it'
      ? 'it'
      : 'en'
    : 'en';

  return (
    <html lang={lang}>
      <head />
      <body>
        <CartProvider>
          <I18nProvider lang={lang}>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md z-50"
            >
              Cart
            </button>

            {isCheckoutOpen && (
              <CheckoutModal onClose={() => setCheckoutOpen(false)} />
            )}

            {children}
          </I18nProvider>
        </CartProvider>
      </body>
    </html>
  );
}