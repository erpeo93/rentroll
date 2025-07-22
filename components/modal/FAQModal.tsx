'use client';

import { useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';
import faqEn from '../../i18n/faq.en.json';
import faqIt from '../../i18n/faq.it.json';
import { ModalWrapper, CloseButton } from './ModalStyles';
import { useUIContext} from '@/lib/UIContext';

export default function FAQModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const lang = typeof window !== 'undefined' && navigator.language.startsWith('it') ? 'it' : 'en';
  const faq = lang === 'it' ? faqIt : faqEn;

useEffect(() => {
  const originalOverflow = document.body.style.overflow;
  const originalHtmlOverflow = document.documentElement.style.overflow;

  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden'; // also prevent touch on mobile

  // Optional: disable iOS scroll bounce
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';

  return () => {
    document.body.style.overflow = originalOverflow;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.position = '';
    document.body.style.width = '';
  };
}, []);

  return (
    <ModalWrapper onClose={onClose}>
      <CloseButton onClick={onClose} />
      <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>FAQ</h2>
      {faq.map((item, i) => (
        <div key={i} style={{ marginBottom: '1rem' }}>
          <strong>{item.q}</strong>
          <p>{item.a}</p>
        </div>
      ))}
      <a href="/terms" target="_blank" style={{ marginTop: '2rem', display: 'inline-block', color: '#2563eb', textDecoration: 'underline' }}>
        View Terms & Conditions
      </a>
    </ModalWrapper>
  );
}