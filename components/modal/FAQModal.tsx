'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import faqEn from '../../i18n/faq.en.json';
import faqIt from '../../i18n/faq.it.json';
import { ModalWrapper, CloseButton } from './ModalStyles';

export default function FAQModal({ onClose }: { onClose: () => void }) {
const { t, language } = useTranslation();
  const faq = language === 'it' ? faqIt : faqEn;

useEffect(() => {
  const scrollY = window.scrollY;
  const originalOverflow = document.body.style.overflow;
  const originalHtmlOverflow = document.documentElement.style.overflow;
  const originalPosition = document.body.style.position;
  const originalTop = document.body.style.top;
  const originalWidth = document.body.style.width;

  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // Fix the body's position so page doesn't jump
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';

  return () => {
    document.body.style.overflow = originalOverflow;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.position = originalPosition;
    document.body.style.top = originalTop;
    document.body.style.width = originalWidth;

    // Restore scroll position on close
    window.scrollTo(0, scrollY);
  };
}, []);

  return (
    <ModalWrapper onClose={onClose}>
      <CloseButton onClick={onClose} />
      <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>FAQ</h2>
      <ul className="divide-y divide-gray-300">
        {faq.map((item, i) => (
          <li key={i} className="py-4">
            <strong className="block mb-1">{item.q}</strong>
            <p>{item.a}</p>
          </li>
        ))}
      </ul>
{/*
      <a
        href="/terms"
        target="_blank"
        className="mt-6 inline-block text-blue-600 underline"
      >
        Vedi termini e condizioni
      </a>
*/}
    </ModalWrapper>
  );
}