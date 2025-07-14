'use client';

import './globals.css';
import { ReactNode, useState } from 'react';
import { I18nProvider } from '../lib/i18n';
import { CartProvider, useCart } from '@/lib/cart-context';
import CheckoutModal from '@/components/modal/CheckoutModal';
import FloatingCartButton from '@/components/FloatingCartButton';

function LayoutWithCart({ children }: { children: ReactNode }) {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const { items: cartItems } = useCart();

  return (
    <>
      {children}

      {/* Show floating cart button if cart is not empty */}
      {cartItems.length > 0 && (
        <FloatingCartButton />
      )}

      {/* Show checkout modal in "cart" mode */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // determine language from search param
  const langParam = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('lang')
    : null;
  const lang = langParam === 'it' ? 'it' : 'en';

  return (
    <html lang={lang}>
      <head />
      <body>
        <CartProvider>
          <I18nProvider lang={lang}>
            <LayoutWithCart>{children}</LayoutWithCart>
          </I18nProvider>
        </CartProvider>
      </body>
    </html>
  );
}