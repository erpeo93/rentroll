'use client';

import { useTranslation } from '@/lib/i18n';
import { useUIContext } from '@/lib/UIContext';
import { useRouter } from 'next/navigation';
import { FaQuestionCircle, FaBars } from 'react-icons/fa';
import { useState } from 'react';

export default function Header() {
  const { t, language, toggleLanguage } = useTranslation();
  const {
    scrollToProductSection,
    setActiveType,
    setShowFAQModal,
    setShowSurpriseModal,
  } = useUIContext();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScrollTo = (type: 'ENTERTAINMENT' | 'CONSUMABLE') => {
    setActiveType(type);
    setTimeout(scrollToProductSection, 100);
    setMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push('/')}
        >
          RentRoll
        </div>

        {/* Desktop nav */}
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

        {/* Right-side controls */}
        <div className="flex items-center gap-3">
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
              <div className="text-button absolute right-0 top-12 bg-white shadow-lg rounded-md border border-neutral-200 w-40 z-50">
                <button
                  className="text-button w-full text-left px-4 py-2 hover:bg-neutral-100 text-sm"
                  onClick={() => handleScrollTo('ENTERTAINMENT')}
                >
                  {t('entertainment')}
                </button>
                <button
                  className="text-button w-full text-left px-4 py-2 hover:bg-neutral-100 text-sm"
                  onClick={() => handleScrollTo('CONSUMABLE')}
                >
                  {t('consumables')}
                </button>
                <button
                  className="text-button w-full text-left px-4 py-2 hover:bg-neutral-100 text-sm"
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

          {/* Language toggle */}
          <button
            className="text-button px-2 py-1 text-xs sm:text-sm"
            onClick={toggleLanguage}
          >
            🌐 {language === 'en' ? 'IT' : 'EN'}
          </button>

          {/* FAQ icon */}
          <button
            className="text-button text-lg sm:text-xl p-1 sm:p-2"
            onClick={() => setShowFAQModal(true)}
            aria-label="FAQ"
          >
            <FaQuestionCircle />
          </button>
        </div>
      </div>
    </header>
  );
}