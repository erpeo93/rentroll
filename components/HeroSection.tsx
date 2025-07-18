'use client';

import { useUIContext } from '@/lib/UIContext';
import { useTranslation } from '../lib/i18n';

type Props = {
  onScrollToCatalog: () => void;
};

export default function HeroSection({ onScrollToCatalog }: Props) {
  const { t } = useTranslation();
  const { setShowFAQModal } = useUIContext();

  return (
    <>
      <section
        style={{
          height: '50vh',
          backgroundImage: "url('/bg2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem',
          color: '#fff',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          position: 'relative',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('hero_title')}</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{t('hero_subtitle')}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onScrollToCatalog} style={{ padding: '1rem 2rem' }}>
            {t('button_start')}
          </button>
          <button onClick={() => setShowFAQModal(true)} style={{ padding: '1rem 2rem' }}>
            FAQ
          </button>
        </div>
      </section>
      <div className="w-full h-3 bg-white" />
    </>
  );
}