'use client';

import { useTranslation } from '@/lib/i18n';
import { useUIContext } from '@/lib/UIContext';
import { useRouter } from 'next/navigation';
import { FaQuestionCircle } from 'react-icons/fa';

export default function Header() {
  const { t, language, toggleLanguage } = useTranslation();
  const {
    scrollToProductSection,
    setActiveType,
    setShowFAQModal,
    setShowSurpriseModal,
  } = useUIContext();
  const router = useRouter();

  const handleScrollTo = (type: 'ENTERTAINMENT' | 'CONSUMABLE') => {
    setActiveType(type);
    setTimeout(scrollToProductSection, 100);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push('/')}
        >
          RentRoll
        </div>

        <nav className="flex gap-3 items-center text-sm font-medium">
          {/* Responsive smaller buttons on mobile */}
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
          <button
            className="text-button px-3 py-1.5 text-xs sm:text-sm"
            onClick={toggleLanguage}
          >
            🌐 {language === 'en' ? 'IT' : 'EN'}
          </button>

          {/* Question mark icon: smaller on mobile */}
          <button
            className="text-button text-lg sm:text-xl p-1 sm:p-2"
            onClick={() => setShowFAQModal(true)}
            aria-label="FAQ"
          >
            <FaQuestionCircle />
          </button>
        </nav>
      </div>
    </header>
  );
}