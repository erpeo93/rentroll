'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useCart } from '@/lib/cart-context';
import CheckoutModal from './CheckoutModal';

type Question = {
  key: string;
  label: string;
  required: boolean;
  options: { label: string; value: string }[];
};

export default function SurpriseMeModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { addItem } = useCart();

  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const [questionProgress, setQuestionProgress] = useState(1);

  const [suggestedProduct, setSuggestedProduct] = useState<any | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

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
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-4 right-4" onClick={onClose}>
          ✖
        </button>

        {!suggestedProduct && (
          <>
            <h2 className="text-lg font-bold mb-2">{t('surprise_step_category')}</h2>
            <select
              value={selectedCategory}
              onChange={(e) => {
                const newCat = e.target.value;
                setSelectedCategory(newCat);
                setFormData({});
                setAnswered({});
                setQuestionProgress(1);
              }}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">--</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {selectedCategory && questionSets[selectedCategory] && (
              <>
                {questionSets[selectedCategory]
                  .slice(0, questionProgress)
                  .map((q) => (
                    <div key={q.key} className="mb-4">
                      <label className="block font-semibold mb-1">{q.label}</label>
                      <select
                        value={formData[q.key] || ''}
                        onChange={(e) => handleChange(q.key, e.target.value)}
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

                {questionSets[selectedCategory].every(
                  (q) => !q.required || answered[q.key]
                ) && (
                  <button
                    onClick={handleSubmit}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {t('surprise_submit')}
                  </button>
                )}
              </>
            )}
          </>
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
            product={suggestedProduct}
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