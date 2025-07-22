'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Footer from '@/components/layout/Footer';

type Props = {
  slug: string;
};

export default function ProductPageClient({ slug }: Props) {
  const router = useRouter();
  const { addItem, isInCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setMainImage("/catan.jfif");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.imageUrl,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error || !product) {
    return <div className="p-6 text-center text-red-600">Error: {error || 'Product not found'}</div>;
  }

  const SECONDARY_IMAGES = ['/catan.jfif', '/catan.jfif', '/catan.jfif'];
  const bulletPoints = product.bulletPoints || [];
  const inCart = isInCart(product.id);

  return (
    <div className = "max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.push('/catalogue')}
        className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:underline"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        Go back to catalogue
      </button>
    <div className="max-w-4xl mx-auto p-6 rounded-lg bg-neutral-100 shadow-sm hover:shadow-md">
      {/* Added border & rounded corners to this main container */}
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-6">{product.description}</p>

      <div className="mb-4 rounded-xl overflow-hidden border border-gray-300 max-h-[400px]">
        <img src="/catan.jfif" alt={product.name} className="w-full h-auto object-cover" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
        {[product.imageUrl, ...SECONDARY_IMAGES].map((img, i) => (
          <button
            key={i}
            onClick={() => setMainImage(img)}
            className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 ${
              img === mainImage ? 'border-blue-600' : 'border-transparent'
            }`}
          >
            <img src="/catan.jfif" alt={`thumb-${i}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Details</h2>
        {bulletPoints.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {bulletPoints.map((point: string, i: number) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No additional details.</p>
        )}
      </section>

      <section className="flex flex-wrap gap-4 mb-8">
        {product.minPlayers && (
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 text-sm font-medium text-gray-700">
            <span>🎲</span>
            <span>
              {product.minPlayers}–{product.maxPlayers ?? product.minPlayers} players
            </span>
          </div>
        )}
        {product.moodTags?.map((tag: string) => (
          <div
            key={tag}
            className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 text-sm font-medium text-gray-700"
          >
            <span>🏷️</span>
            <span>{tag}</span>
          </div>
        ))}
      </section>

      <div className="max-w-xs w-full">
        <button
          onClick={inCart && !justAdded ? () => router.push('/cart') : handleAddToCart}
          className={`px-6 py-3 rounded-md text-white w-full transition-all duration-300 flex items-center justify-center gap-2 ${
            justAdded
              ? 'bg-green-600'
              : inCart
              ? 'bg-green-700 hover:bg-green-800'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {justAdded ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Added to Cart
            </>
          ) : inCart ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13L17 13M7 13L5.4 5M17 13l1.5 6M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              Go to Cart
            </>
          ) : (
            <>Add to Cart</>
          )}
        </button>
      </div>
      </div>
    </div>
      <Footer />
</div>
  );
}