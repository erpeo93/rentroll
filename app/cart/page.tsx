'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import CheckoutModal from '@/components/modal/CheckoutModal';

export default function CartPage() {
  const { items, updateQuantity, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity <= 1) {
      updateQuantity(id, 0); // This will remove the item
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  return (
    <div className="px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl rounded-xl p-6 bg-neutral-100 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-300">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <img
                    src="catan.jfif"
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl leading-none"
                    >
                      –
                    </button>
                    <span className="text-md w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl leading-none"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setCheckoutOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="text-sm text-gray-600 hover:underline"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}

        {checkoutOpen && (
          <CheckoutModal
            startStep={2}
            onClose={() => setCheckoutOpen(false)}
          />
        )}
      </div>
    </div>
  );
}