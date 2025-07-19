'use client';

import { useUIContext } from '@/lib/UIContext';
import { FaQuestionCircle } from 'react-icons/fa';

export default function FloatingFAQButton() {
  const { setShowFAQModal } = useUIContext();

  return (
    <button
      onClick={() => setShowFAQModal(true)}
      className="fixed bottom-4 left-4 bg-gray-700 text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition z-50 flex items-center"
      aria-label="Open FAQ"
    >
      <FaQuestionCircle className="text-xl" />
    </button>
  );
}