'use client';

import './globals.css';
import { ReactNode, useState } from 'react';
import { I18nProvider } from '../lib/i18n';
import { CartProvider, useCart } from '@/lib/cart-context';
import CheckoutModal from '@/components/modal/CheckoutModal';
import FloatingCartButton from '@/components/FloatingCartButton';
import { UIProvider, useUIContext } from '@/lib/UIContext';
import Header from '@/components/layout/Header';

function LayoutWithCart({ children }: { children: ReactNode }) {
  const { items: cartItems } = useCart();
  const { selectedProduct, isCheckoutOpen, closeCheckout } = useUIContext();

  return (
    <>
      {children}

      {/* Show floating cart button if cart is not empty */}
      {cartItems.length > 0 && (
        <FloatingCartButton />
      )}

      {/* Show checkout modal in "cart" mode */}
      {isCheckoutOpen && selectedProduct && (
        <CheckoutModal product={selectedProduct}
          onClose={() => {closeCheckout }}
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
      <body className="bg-gray-50 text-gray-900">
        <CartProvider>
	<UIProvider>
        <Header />
          <I18nProvider lang={lang}>
            <LayoutWithCart>{children}</LayoutWithCart>
          </I18nProvider>
	</UIProvider>
        </CartProvider>
      </body>
    </html>
  );
}