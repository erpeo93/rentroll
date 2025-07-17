'use client';

import { createContext, useContext, useRef, useState } from 'react';
import FAQModal from '@/components/modal/FAQModal';
import SurpriseMeModal from '@/components/modal/SurpriseMeModal'; // adjust path if needed
import CheckoutModal from '@/components/modal/CheckoutModal';

import { Product } from '@prisma/client';
type ProductType = 'ENTERTAINMENT' | 'CONSUMABLE';

interface UIContextType {
  scrollToProductSection: () => void;
  setActiveType: (type: ProductType) => void;
  activeType: ProductType;
  setShowFAQModal: (v: boolean) => void;
  setShowSurpriseModal: (v: boolean) => void;
  startCheckout: (product: Product) => void;
  selectedProduct: Product | null;
  isCheckoutOpen: boolean;
  closeCheckout: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export const useUIContext = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUIContext must be used within UIProvider');
  return ctx;
};

export function UIProvider({ children }: { children: React.ReactNode }) {
  const productSectionRef = useRef<HTMLDivElement>(null);
  const [activeType, setActiveType] = useState<ProductType>('ENTERTAINMENT');
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [isCheckoutOpen, setCheckoutOpen] = useState(false);

const startCheckout = (product: Product) => {
  setSelectedProduct(product);
  setCheckoutOpen(true);
};

const closeCheckout = () => {
  setSelectedProduct(null);
  setCheckoutOpen(false);
};

const scrollToProductSection = () => {
  if (!productSectionRef.current) return;

  // Get the distance from top of document to product section
  const rect = productSectionRef.current.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Adjust for fixed header height (replace 60 with your header height in px)
  const headerHeight = 60;

  const targetPosition = rect.top + scrollTop - headerHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
};

  return (
    <UIContext.Provider
      value={{
        scrollToProductSection,
        setActiveType,
        activeType,
        setShowFAQModal,
        setShowSurpriseModal,
    startCheckout,
    selectedProduct,
    isCheckoutOpen,
    closeCheckout,
      }}
    >
      {children}

{showFAQModal && <FAQModal onClose={() => setShowFAQModal(false)} />}
{showSurpriseModal && <SurpriseMeModal onClose={() => setShowSurpriseModal(false)} />}

{isCheckoutOpen && selectedProduct && (
  <CheckoutModal
    product={selectedProduct}
    productType={activeType}
    onClose={closeCheckout}
  />
)}
      {/* Product section anchor */}
      <div ref={productSectionRef} id="product-section" />
    </UIContext.Provider>
  );
}