'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useUIContext } from '@/lib/UIContext';
import { useRouter } from 'next/navigation';
import { FaBars } from 'react-icons/fa';

export default function Header() {
  const { t } = useTranslation();
  const {
    setShowSurpriseModal,
  } = useUIContext();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleRouteToCatalogue = (type: 'ENTERTAINMENT' | 'CONSUMABLE') => {
    setMenuOpen(false);
    router.push(`/catalogue?type=${type}`);
  };

  const handleSurprise = () => {
    setMenuOpen(false);
    router.push('/catalogue?type=ENTERTAINMENT');
    setTimeout(() => setShowSurpriseModal(true), 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const isTop = y <= 10;

      setAtTop(isTop);

      if (isTop) {
        setShowHeader(true);
        return;
      }

      setShowHeader(false);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        setShowHeader(true);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <header
      className={`
        bg-white shadow z-50 transition-transform duration-300 ease-in-out
        ${atTop ? 'relative' : 'fixed top-0 left-0 right-0'}
        ${showHeader ? 'translate-y-0' : '-translate-y-full'}
      `}
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
            onClick={() => handleRouteToCatalogue('ENTERTAINMENT')}
          >
            {t('entertainment')}
          </button>
          <button
            className="text-button px-3 py-1.5 text-xs sm:text-sm"
            onClick={() => handleRouteToCatalogue('CONSUMABLE')}
          >
            {t('consumables')}
          </button>
          <button
            className="text-button px-3 py-1.5 text-xs sm:text-sm"
            onClick={handleSurprise}
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
                className="text-button w-full text-left px-4 py-2 hover:bg-neutral-100 text-sm"
                onClick={() => handleRouteToCatalogue('ENTERTAINMENT')}
              >
                {t('entertainment')}
              </button>
              <button
                className="text-button w-full text-left px-4 py-2 hover:bg-neutral-100 text-sm"
                onClick={() => handleRouteToCatalogue('CONSUMABLE')}
              >
                {t('consumables')}
              </button>
              <button
                className="text-button w-full text-left px-4 py-2 hover:bg-neutral-100 text-sm"
                onClick={handleSurprise}
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