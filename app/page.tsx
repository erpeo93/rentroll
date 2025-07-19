'use client';

import { useRef, Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import ProductSearchSection from '../components/ProductSearchSection';
import { useUIContext } from '@/lib/UIContext';
import HomeSearchHandler from '../components/HomeSearchHandler';

export default function HomePage() {
  const { activeType, setActiveType } = useUIContext();
  const catalogRef = useRef<HTMLDivElement>(null);

  return (
    <main>
      <HeroSection
        onScrollToCatalog={() => {
          catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      <ProductCarousel />

      {/* Use Suspense for reading URL search params */}
      <Suspense fallback={null}>
        <HomeSearchHandler catalogRef={catalogRef} />
      </Suspense>

      <div ref={catalogRef}>
        <ProductSearchSection
          activeType={activeType}
          setActiveType={setActiveType}
        />
      </div>
    </main>
  );
}