'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../lib/i18n';
import CheckoutModal from './modal/CheckoutModal';
import { useRouter } from 'next/navigation';

export default function ProductCarousel() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollSpeedRef = useRef<number>(1);
  const lastScrollTimeRef = useRef<number>(0);

  const router = useRouter();

  useEffect(() => {
    fetch('/api/products/hot')
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || products.length === 0) return;

    let animationFrame: number;

    const scrollStep = (timestamp: number) => {
      const timeDiff = timestamp - lastScrollTimeRef.current;

      // Scroll every 20ms to slow things down a bit
      if (timeDiff > 20) {
        const scrollAmount = el.offsetWidth * 0.0025 * scrollSpeedRef.current; // relative to container width
        el.scrollLeft += scrollAmount;

        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }

        lastScrollTimeRef.current = timestamp;
      }

      animationFrame = requestAnimationFrame(scrollStep);
    };

    animationFrame = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrame);
  }, [products]);

  const handleMouseEnter = () => {
    scrollSpeedRef.current = 0.5;
  };

  const handleMouseLeave = () => {
    scrollSpeedRef.current = 1;
  };

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && carouselRef.current) {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      const scrollAmount = carouselRef.current.offsetWidth * 0.5;

      if (diff > 50) {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else if (diff < -50) {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
    touchStartX.current = null;
  };

  return (
    <>
      <section
        className="relative w-full h-[50vh] overflow-hidden bg-neutral-100 px-6 flex items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left gradient */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-neutral-100 to-transparent z-10" />
        {/* Right gradient */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-neutral-100 to-transparent z-10" />

        <div
          ref={carouselRef}
          className="w-full overflow-x-auto scroll-smooth no-scrollbar flex gap-1 pr-6 group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {[...products, ...products].map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 cursor-pointer scale-90 hover:scale-95 transition-transform duration-300 
                         group-hover:opacity-40 hover:opacity-100"
              onClick={() => router.push(`/product/${product.slug}`)}
            >
              <div className="border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <img
                    src={'catan.jfif'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl text-neutral-900 shadow-md min-w-[66%] max-w-[66%]">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    {product.description && (
                      <p className="text-sm mt-1 line-clamp-2">{product.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <CheckoutModal
            product={selectedProduct}
            productType={selectedProduct.category?.type || 'ENTERTAINMENT'}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </section>

      <div className="w-full h-3 bg-white" />
    </>
  );
}