'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useUIContext } from '@/lib/UIContext';
import { useRouter } from 'next/navigation';
import { FaBars } from 'react-icons/fa';

export default function Header() {
  const { t } = useTranslation();
  const {
    scrollToProductSection,
    setActiveType,
    setShowSurpriseModal,
  } = useUIContext();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleScrollTo = (type: 'ENTERTAINMENT' | 'CONSUMABLE') => {
    setActiveType(type);
    setTimeout(scrollToProductSection, 100);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide header on scroll down
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      }

      // Show header after user stops scrolling
      if (scrollTimeout) clearTimeout(scrollTimeout);
      const timeout = setTimeout(() => {
        setShowHeader(true);
      }, 500); // <- 500ms delay (previously 150)

      setScrollTimeout(timeout);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, scrollTimeout]);

  return (
    <header
      className={`bg-white shadow fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        showHeader ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push('/')}
        >
          RentRoll
        </div>

        {/* Desktop navigation */}
        <nav className="hidden sm:flex gap-3 items-center text-sm font-medium">
          <button
            className="text-button px-3 py-1.5 text-xs sm:text-sm"
            onClick={() => handleScrollTo('ENTERTAINMENT')}
          >
            {t('entertainment')}
          </button>
          <button
            className="text-button px-3 py-1.5 text-xs sm:text-sm"
            onClick={() => handleScrollTo('CONSUMABLE')}
          >
            {t('consumables')}
          </button>
          <button
            className="text-button px-3 py-1.5 text-xs sm:text-sm"
            onClick={() => setShowSurpriseModal(true)}
          >
            {t('surprise_me')}
          </button>
        </nav>

        {/* Mobile hamburger menu */}
        <div className="sm:hidden relative">
          <button
            className="text-button p-2 text-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <FaBars />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md border border-neutral-200 w-40 z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-neutral-100 text-sm"
                onClick={() => handleScrollTo('ENTERTAINMENT')}
              >
                {t('entertainment')}
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-neutral-100 text-sm"
                onClick={() => handleScrollTo('CONSUMABLE')}
              >
                {t('consumables')}
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-neutral-100 text-sm"
                onClick={() => {
                  setShowSurpriseModal(true);
                  setMenuOpen(false);
                }}
              >
                {t('surprise_me')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}