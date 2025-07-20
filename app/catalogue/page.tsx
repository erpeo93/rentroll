'use client';

import { Suspense } from 'react';
import CatalogueSearchHandler from '../../components/CatalogueSearchHandler';
import CatalogueBanner from '../../components/CatalogueBanner';
import ProductSearchSection from '../../components/ProductSearchSection';
import { useUIContext } from '@/lib/UIContext';
import Footer from '../../components/layout/Footer';

export default function CataloguePage() {
  const { activeType, setActiveType } = useUIContext();

  return (
    <main className="px-4">
      <Suspense fallback={null}>
        <CatalogueSearchHandler />
      </Suspense>

      <ProductSearchSection
        activeType={activeType}
        setActiveType={setActiveType}
      />

      <Footer />
    </main>
  );
}