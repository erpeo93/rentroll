'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Dummy static content
const SECONDARY_IMAGES = ['/example-2.jfif', '/example-3.jfif', '/example-4.jfif'];
const DETAILED_DESCRIPTION = 'This is an extended detailed description of the product.';
const TAG_ICONS = [
  { label: '2 players', icon: '🎲' },
  { label: 'DVD', icon: '📀' },
  { label: 'Thriller', icon: '🔪' },
];

type Props = {
  slug: string;
};

export default function ProductPageClient({ slug }: Props) {
  const router = useRouter();
  const { addItem } = useCart();

  const product = {
    id: '1',
    name: slug.replace(/-/g, ' '),
    description: 'This is the main description of the product.',
    image: '/catan.jfif',
  };

  const [mainImage, setMainImage] = useState(product.image);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => router.push('/catalogue')} className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:underline">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        Go back to catalogue
      </button>

      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-6">{product.description}</p>

      <div className="mb-4 rounded-xl overflow-hidden border border-gray-300 max-h-[400px]">
        <img src={mainImage} alt={product.name} className="w-full h-auto object-cover" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
        {[product.image, ...SECONDARY_IMAGES].map((img, i) => (
          <button
            key={i}
            onClick={() => setMainImage(img)}
            className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 ${
              img === mainImage ? 'border-blue-600' : 'border-transparent'
            }`}
          >
            <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Details</h2>
        <p className="text-gray-700 whitespace-pre-line">{DETAILED_DESCRIPTION}</p>
      </section>

      <section className="flex flex-wrap gap-4 mb-8">
        {TAG_ICONS.map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 text-sm font-medium text-gray-700">
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <button
        onClick={() =>
          addItem({
            id: product.id,
            name: product.name,
            description: product.description,
            image: product.image,
          })
        }
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition w-full max-w-xs"
      >
        Add to Cart
      </button>
    </div>
  );
}