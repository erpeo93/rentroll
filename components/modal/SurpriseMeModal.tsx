'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useCart } from '@/lib/cart-context';
import CheckoutModal from './CheckoutModal';

interface Question {
  key: string;
  label: string;
  options: { label: string; value: string }[];
  required: boolean;
}

export default function SurpriseMeModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { addItem } = useCart();

  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [suggestedProduct, setSuggestedProduct] = useState<any | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [visibleQuestions, setVisibleQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allRequiredAnswered, setAllRequiredAnswered] = useState(false);

const questionSets: Record<string, Question[]> = {
  'board-game': [
    {
      key: 'players',
      label: t('surprise_step_players'),
      required: true,
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3+', value: '3+' },
      ],
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
      key: 'players',
      label: t('surprise_step_players'),
      required: true,
      options: [
        { label: t('solo'), value: 'solo' },
        { label: t('multiplayer'), value: 'multiplayer' },
      ],
    },
    {
      key: 'genre',
      label: t('surprise_step_genre'),
      required: true,
      options: [
        { label: t('genre_action'), value: 'action' },
        { label: t('genre_strategy'), value: 'strategy' },
        { label: t('genre_puzzle'), value: 'puzzle' },
      ],
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

  'book': [
    {
      key: 'genre',
      label: t('surprise_step_genre'),
      required: true,
      options: [
        { label: t('genre_fantasy'), value: 'fantasy' },
        { label: t('genre_thriller'), value: 'thriller' },
        { label: t('genre_nonfiction'), value: 'nonfiction' },
      ],
    },
    {
      key: 'length',
      label: t('surprise_step_length'),
      required: false,
      options: [
        { label: t('length_short'), value: 'short' },
        { label: t('length_medium'), value: 'medium' },
        { label: t('length_long'), value: 'long' },
      ],
    },
  ],

  'film': [
    {
      key: 'genre',
      label: t('surprise_step_genre'),
      required: true,
      options: [
        { label: t('genre_comedy'), value: 'comedy' },
        { label: t('genre_drama'), value: 'drama' },
        { label: t('genre_horror'), value: 'horror' },
      ],
    },
    {
      key: 'length',
      label: t('surprise_step_length'),
      required: false,
      options: [
        { label: t('length_short'), value: 'short' },
        { label: t('length_standard'), value: 'standard' },
        { label: t('length_epic'), value: 'epic' },
      ],
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
};

  useEffect(() => {
    fetch('/api/categories?type=ENTERTAINMENT')
      .then((res) => res.json())
      .then((data) => {
        setCategories(
          data.map((c: any) => ({ slug: c.slug, name: t(`category_${c.slug}`) || c.name }))
        );
      });
  }, [t]);

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setFormData({});
    setSuggestedProduct(null);
    const set = questionSets[value];
    setVisibleQuestions(set ? [set[0]] : []);
    setCurrentQuestionIndex(0);
    setAllRequiredAnswered(false);
  };

  const handleAnswer = (key: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };

      const fullSet = questionSets[selectedCategory] || [];
      const unansweredRequired = fullSet.filter(
        (q) => q.required && !updated[q.key]
      );

      setAllRequiredAnswered(unansweredRequired.length === 0);

      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < fullSet.length && !visibleQuestions.includes(fullSet[nextIndex])) {
        setVisibleQuestions(fullSet.slice(0, nextIndex + 1));
        setCurrentQuestionIndex(nextIndex);
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    const params = new URLSearchParams({
      category: selectedCategory,
      type: 'ENTERTAINMENT',
      ...formData
    });

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    if (data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)];
      setSuggestedProduct(random);
    } else {
      alert('No matching products found');
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-4 right-4 text-xl" onClick={onClose}>
          ✖
        </button>

        {!selectedCategory && (
          <div>
            <h2 className="text-lg font-bold mb-2">{t('surprise_step_category')}</h2>
            <select
              value=""
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">--</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCategory && !suggestedProduct && (
          <div className="space-y-6">
            {visibleQuestions.map((q) => (
              <div key={q.key}>
                <h2 className="text-lg font-bold mb-2">{q.label}</h2>
                <select
                  value={formData[q.key] || ''}
                  onChange={(e) => handleAnswer(q.key, e.target.value)}
                  className="w-full border p-2 rounded"
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

            {allRequiredAnswered && (
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white px-4 py-2 rounded"
              >
                {t('surprise_submit')}
              </button>
            )}
          </div>
        )}

        {suggestedProduct && (
          <div>
            <h2 className="text-lg font-bold mb-4">🎉 {t('surprise_result')}</h2>
            <div className="mb-4">
              <h3 className="font-semibold">{suggestedProduct.name}</h3>
              <p>{t(`category_${suggestedProduct.category?.slug}`)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCheckout(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {t('buy_now')}
              </button>
              <button
                onClick={() => {
                  addItem(suggestedProduct);
                  onClose();
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                {t('add_to_cart')}
              </button>
            </div>
          </div>
        )}

        {showCheckout && suggestedProduct && (
          <CheckoutModal
            productId={suggestedProduct.id}
            onClose={() => {
              setShowCheckout(false);
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
}