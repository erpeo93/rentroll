'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import CheckoutModal from '@/components/modal/CheckoutModal';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-300">
            {items.map((item) => (
              <li key={item.id} className="py-4 flex justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  {item.variant && <p className="text-sm text-gray-600">Variant: {item.variant}</p>}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
            >
              Clear Cart
            </button>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
