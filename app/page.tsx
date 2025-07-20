'use client';

import { useRef, Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import CatalogueBanner from '../components/CatalogueBanner';
import { useUIContext } from '@/lib/UIContext';
import Footer from '../components/layout/Footer';

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
      <CatalogueBanner />

      <Footer />
    </main>
  );
}