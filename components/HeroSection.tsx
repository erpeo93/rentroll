'use client';

import { useUIContext } from '@/lib/UIContext';
import { useTranslation } from '../lib/i18n';
import { useRouter } from 'next/navigation';

type Props = {
  onScrollToCatalog?: () => void;
};

export default function HeroSection({ onScrollToCatalog }: Props) {
  const { t } = useTranslation();
  const { setShowFAQModal } = useUIContext();
  const router = useRouter();

  return (
    <>
      <section
        style={{
          height: '70vh',
          backgroundImage: "url('/bg2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
        }}
      >
        <div
          style={{
            maxWidth: '960px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('hero_title')}</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>{t('hero_subtitle')}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/catalogue')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded shadow transition"
            >
              {t('button_start') || 'Discover all products'}
            </button>
            <button
              onClick={() => setShowFAQModal(true)}
              className="bg-white hover:bg-gray-100 text-indigo-700 px-6 py-3 rounded shadow transition"
            >
              FAQ
            </button>
          </div>
        </div>
      </section>
      <div className="w-full h-3 bg-white" />
    </>
  );
}