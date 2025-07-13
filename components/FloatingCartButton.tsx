'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

export default function FloatingCartButton() {
  const { items } = useCart();
  const router = useRouter();

  if (items.length === 0) return null;

  return (
    <button
      onClick={() => router.push('/cart')}
      className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition z-50"
    >
      🛒
      <span className="ml-1 text-sm font-semibold">{items.length}</span>
    </button>
  );
}