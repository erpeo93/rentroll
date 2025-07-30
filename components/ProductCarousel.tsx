'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../lib/i18n';
import { useRouter } from 'next/navigation';
import { useUIContext } from '@/lib/UIContext';

export default function ProductCarousel() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollSpeedRef = useRef<number>(1);
  const lastScrollTimeRef = useRef<number>(0);
const { showFAQModal } = useUIContext();

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

      if (timeDiff > 20) {
	var baseSpeedFactor = 1200.0; // tweak this number for speed scaling
if (showFAQModal  ) baseSpeedFactor = 0;
	const scrollAmount = baseSpeedFactor / el.offsetWidth * scrollSpeedRef.current;
        el.scrollLeft += scrollAmount;

        // Looping logic: once halfway, reset
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }

        lastScrollTimeRef.current = timestamp;
      }

      animationFrame = requestAnimationFrame(scrollStep);
    };

    animationFrame = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrame);
  }, [products, showFAQModal]);

  const handleMouseEnter = () => {
    scrollSpeedRef.current = 0.5;
  };

  const handleMouseLeave = () => {
    scrollSpeedRef.current = 1;
  };

  return (
    <>
      <section
        className="relative w-full h-[50vh] overflow-hidden bg-neutral-100 px-6 flex items-center"
      >
        {/* Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-neutral-100 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-neutral-100 to-transparent z-10" />

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="carousel-container w-full overflow-x-hidden scroll-smooth no-scrollbar flex gap-1 pr-6 group"
style={{ touchAction: 'none' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {[...products, ...products].map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 cursor-pointer scale-80 hover:scale-85 transition-transform duration-300 
                         group-hover:opacity-40 hover:opacity-100"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <div className="border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <img
                    src={'catan.jfif'} // Replace with product.image when dynamic
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
      </section>
    </>
  );
}