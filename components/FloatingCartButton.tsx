'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter, usePathname } from 'next/navigation';

export default function FloatingCartButton() {
  const { items } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const isCartPage = pathname === '/cart';

  // Always show on cart page for "Back to Home"
  if (items.length === 0 && !isCartPage) return null;

  const handleClick = () => {
    if (isCartPage) {
      router.push('/');
    } else {
      router.push('/cart');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition z-50 flex items-center"
    >
      {isCartPage ? '🏠' : '🛒'}
      {!isCartPage && (
        <span className="ml-1 text-sm font-semibold">{items.length}</span>
      )}
    </button>
  );
}