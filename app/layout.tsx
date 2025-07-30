'use client';

import './globals.css';
import { ReactNode, useState, useEffect } from 'react';
import { I18nProvider } from '../lib/i18n';
import { CartProvider, useCart } from '@/lib/cart-context';
import CheckoutModal from '@/components/modal/CheckoutModal';
import FloatingCartButton from '@/components/FloatingCartButton';
import FloatingFAQButton from '@/components/FloatingFAQButton';
import { UIProvider, useUIContext } from '@/lib/UIContext';
import Header from '@/components/layout/Header';
import initAutocomplete from '@/components/AutocompleteInput';
import Script from 'next/script';

function LayoutWithCart({ children }: { children: ReactNode }) {

  const { items: cartItems } = useCart();
  const { selectedProduct, isCheckoutOpen, closeCheckout } = useUIContext();

  return (
    <>
      {children}
<FloatingFAQButton />
        <FloatingCartButton />

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
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  return (
    <html lang={lang}>
<head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`}
          strategy="beforeInteractive"
        />
</head>
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