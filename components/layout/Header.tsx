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
        <div className="text-xl font-bold cursor-pointer" onClick={() => router.push('/')}>
          RentRoll
        </div>
<nav className="flex gap-4 items-center text-sm font-medium">
  <button className="text-button" onClick={() => handleScrollTo('ENTERTAINMENT')}>
    {t('entertainment')}
  </button>
  <button className="text-button" onClick={() => handleScrollTo('CONSUMABLE')}>
    {t('consumables')}
  </button>
  <button className="text-button" onClick={() => setShowSurpriseModal(true)}>
    {t('surprise_me')}
  </button>
  <button className="text-button" onClick={toggleLanguage}>
    🌐 {language === 'en' ? 'IT' : 'EN'}
  </button>
  <button className="text-button text-lg" onClick={() => setShowFAQModal(true)}>
    <FaQuestionCircle />
  </button>
</nav>
      </div>
    </header>
  );
}