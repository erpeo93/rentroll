'use client';

import { useRef } from 'react';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import { useUIContext } from '@/lib/UIContext';
import ProductSearchSection from '../components/ProductSearchSection';

export default function HomePage() {
const { activeType, setActiveType } = useUIContext();
  const catalogRef = useRef<HTMLDivElement>(null);

  return (
    <main>
      <HeroSection onScrollToCatalog={() => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
      }} />
      <ProductCarousel />
      <div ref={catalogRef}>
        <ProductSearchSection 
        activeType={activeType}
        setActiveType={setActiveType}
	/>
      </div>
    </main>
  );
}