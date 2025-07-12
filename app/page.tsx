'use client';

import { useRef } from 'react';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import ProductSearchSection from '../components/ProductSearchSection';

export default function HomePage() {
  const catalogRef = useRef<HTMLDivElement>(null);

  return (
    <main>
      <HeroSection onScrollToCatalog={() => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
      }} />
      <ProductCarousel />
      <div ref={catalogRef}>
        <ProductSearchSection />
      </div>
    </main>
  );
}