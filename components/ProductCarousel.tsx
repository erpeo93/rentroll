'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../lib/i18n';
import CheckoutModal from './modal/CheckoutModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCarousel() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // References to carousel container and first product card
  const carouselRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  // Track current product index shown (0-based)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch hot products
  useEffect(() => {
    fetch('/api/products/hot')
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const totalProducts = products.length;

  // Scroll to product by index
  const scrollToIndex = (index: number) => {
    if (!carouselRef.current || !productRef.current) return;

    const cardWidth = productRef.current.offsetWidth + 24; // product width + gap (gap-6 = 1.5rem = 24px)

    const scrollPosition = cardWidth * index;
    carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  // Scroll one product left
  const prev = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  // Scroll one product right
  const next = () => {
    const newIndex = Math.min(currentIndex + 1, totalProducts - 1);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  // Touch handlers for swipe
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (diff > 50) next();
      else if (diff < -50) prev();
    }
    touchStartX.current = null;
  };

  // Sync currentIndex when user manually scrolls the carousel (optional)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || !productRef.current) return;

    const cardWidth = productRef.current.offsetWidth + 24;

    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const index = Math.round(scrollLeft / cardWidth);
      if (index !== currentIndex) setCurrentIndex(index);
    };

    el.addEventListener('scroll', onScroll, { passive: true });

    return () => el.removeEventListener('scroll', onScroll);
  }, [currentIndex]);

  return (
    <>
      <section
        className="relative w-full h-[50vh] overflow-hidden bg-neutral-100 px-6 flex items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* Arrows (Desktop only) */}
        <button
          className="carousel-arrow hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white p-2 rounded-full"
          onClick={prev}
          aria-label={t('previous')}
        >
          <ChevronLeft size={28} />
        </button>
        <button
          className="carousel-arrow hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white p-2 rounded-full"
          onClick={next}
          aria-label={t('next')}
        >
          <ChevronRight size={28} />
        </button>

        {/* Carousel Track with scroll snapping */}
        <div
          ref={carouselRef}
          className="w-full overflow-x-auto scroll-smooth no-scrollbar flex gap-6 snap-x snap-mandatory"
        >

          {products.map((product, i) => (
            <div
              key={product.id}
              ref={i === 0 ? productRef : null}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 cursor-pointer scale-90 hover:scale-95 transition-transform snap-start"
              onClick={() => setSelectedProduct(product)}
            >
              {/* Widget container */}
              <div className="p-4 border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <img
                    src={'catan.jfif' /*product.imageUrl || 'catan.jfif'*/}
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

        {/* Checkout Modal */}
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