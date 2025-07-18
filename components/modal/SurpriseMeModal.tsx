'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useCart } from '@/lib/cart-context';
import { useUIContext } from '@/lib/UIContext';
import { ModalWrapper } from '@/components/modal/ModalStyles';

type Question = {
  key: string;
  label: string;
  required: boolean;
  options: { label: string; value: string }[];
};

export default function SurpriseMeModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { startCheckout, setShowSurpriseModal } = useUIContext();

  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const [questionProgress, setQuestionProgress] = useState(1);

  useEffect(() => {
    fetch('/api/categories?type=ENTERTAINMENT')
      .then((res) => res.json())
      .then((data) => {
        setCategories(
          data.map((c: any) => ({
            slug: c.slug,
            name: t(`category_${c.slug}`) || c.name,
          }))
        );
      });
  }, [t]);

  const questionSets: Record<string, Question[]> = {
    'board-game': [
      {
        key: 'players',
        label: t('surprise_step_players'),
        required: true,
        options: ['1', '2', '3+'].map((v) => ({ label: v, value: v })),
      },
      {
        key: 'mood',
        label: t('surprise_step_mood'),
        required: false,
        options: [
          { label: t('mood_chill'), value: 'chill' },
          { label: t('mood_competitive'), value: 'competitive' },
          { label: t('mood_funny'), value: 'funny' },
        ],
      },
    ],
    'video-game': [
      {
        key: 'platform',
        label: t('surprise_step_platform'),
        required: true,
        options: ['PC', 'PlayStation', 'Xbox', 'Switch'].map((v) => ({
          label: v,
          value: v,
        })),
      },
      {
        key: 'mood',
        label: t('surprise_step_mood'),
        required: false,
        options: [
          { label: t('mood_chill'), value: 'chill' },
          { label: t('mood_competitive'), value: 'competitive' },
          { label: t('mood_funny'), value: 'funny' },
        ],
      },
    ],
    book: [
      {
        key: 'genre',
        label: t('surprise_step_genre'),
        required: true,
        options: ['fiction', 'non-fiction', 'fantasy', 'mystery'].map((v) => ({
          label: v,
          value: v,
        })),
      },
    ],
    film: [
      {
        key: 'mood',
        label: t('surprise_step_mood'),
        required: true,
        options: [
          { label: t('mood_chill'), value: 'chill' },
          { label: t('mood_funny'), value: 'funny' },
          { label: t('mood_educational'), value: 'educational' },
        ],
      },
    ],
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setAnswered((prev) => ({ ...prev, [field]: true }));

    const questions = questionSets[selectedCategory] || [];
    const currentIndex = questions.findIndex((q) => q.key === field);
    const nextQuestionIndex = currentIndex + 1;

    if (nextQuestionIndex >= questionProgress && nextQuestionIndex < questions.length) {
      setQuestionProgress(nextQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    const params = new URLSearchParams({
      category: selectedCategory,
      type: 'ENTERTAINMENT',
      ...formData,
    });

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    if (data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)];

      setShowSurpriseModal(false);
      startCheckout(random);
    } else {
      alert('No matching products found');
      onClose();
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      {/* ModalWrapper handles overlay, close button, container etc */}

  <h1 className="text-2xl font-bold mb-1">{t('surprise_me')}</h1>
  <p className="text-gray-600 mb-6">{t('surprise_me_subtitle')}</p>

<div className="mb-6 flex items-center space-x-4">
  <label htmlFor="category-select" className="w-1/3 font-semibold">
    {t('surprise_step_category')}
  </label>
  <select
    id="category-select"
    value={selectedCategory}
    onChange={(e) => {
      const newCat = e.target.value;
      setSelectedCategory(newCat);
      setFormData({});
      setAnswered({});
      setQuestionProgress(1);
    }}
    className="w-2/3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="">--</option>
    {categories.map((c) => (
      <option key={c.slug} value={c.slug}>
        {c.name}
      </option>
    ))}
  </select>
</div>
      {selectedCategory && questionSets[selectedCategory] && (
        <>
{questionSets[selectedCategory]
  .slice(0, questionProgress)
  .map((q) => (
    <div key={q.key} className="mb-4 flex items-center space-x-4">
      <label className="w-1/3 font-semibold">{q.label}</label>
      <select
        value={formData[q.key] || ''}
        onChange={(e) => handleChange(q.key, e.target.value)}
        className="w-2/3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">--</option>
        {q.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ))}
          {questionSets[selectedCategory].every((q) => !q.required || answered[q.key]) && (
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
            >
              {t('surprise_submit')}
            </button>
          )}
        </>
      )}
    </ModalWrapper>
  );
}