'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useCart } from '@/lib/cart-context';
import CheckoutModal from './CheckoutModal';

export default function SurpriseMeModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { addItem } = useCart();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    players: '',
    mood: ''
  });
  const [suggestedProduct, setSuggestedProduct] = useState<any | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetch('/api/categories?type=ENTERTAINMENT')
      .then((res) => res.json())
      .then((data) => {
        setCategories(
          data.map((c: any) => ({ slug: c.slug, name: t(`category_${c.slug}`) || c.name }))
        );
      });
  }, [t]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const params = new URLSearchParams({
      category: formData.category,
      type: 'ENTERTAINMENT'
    });
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    if (data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)];
      setSuggestedProduct(random);
      setStep(4);
    } else {
      alert('No matching products found');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <button className="absolute top-4 right-4" onClick={onClose}>✖</button>

        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold mb-2">{t('surprise_step_category')}</h2>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">--</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <button
              disabled={!formData.category}
              onClick={() => setStep(2)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              {t('next')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold mb-2">{t('surprise_step_players')}</h2>
            <select
              value={formData.players}
              onChange={(e) => handleChange('players', e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3+">3+</option>
            </select>
            <button
              disabled={!formData.players}
              onClick={() => setStep(3)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              {t('next')}
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold mb-2">{t('surprise_step_mood')}</h2>
            <select
              value={formData.mood}
              onChange={(e) => handleChange('mood', e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">--</option>
              <option value="chill">{t('mood_chill')}</option>
              <option value="competitive">{t('mood_competitive')}</option>
              <option value="funny">{t('mood_funny')}</option>
            </select>
            <button
              disabled={!formData.mood}
              onClick={handleSubmit}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              {t('surprise_submit')}
            </button>
          </div>
        )}

        {step === 4 && suggestedProduct && (
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
      </div>

      {showCheckout && (
        <CheckoutModal
          productId={suggestedProduct.id}
          onClose={() => {
            setShowCheckout(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}