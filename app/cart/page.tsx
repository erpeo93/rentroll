'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import Footer from '../../components/layout/Footer';

export default function CartPage() {
  const { items, updateQuantity, clearCart, getTotalPrice } = useCart();
  const router = useRouter();

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity <= 1) {
      updateQuantity(id, 0);
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  return (
    <main className="px-0">
      <div className="px-0 py-10 flex justify-center">
<div className="w-full max-w-full sm:max-w-3xl rounded-xl p-3">
      <button
        onClick={() => router.push('/catalogue')}
        className="inline-flex items-center gap-2 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        Go back to catalogue
      </button>
        <div className="w-full max-w-full  sm:max-w-3xl rounded-xl p-6 bg-neutral-100 shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-300">
                {items.map((item) => (
                  <li key={item.id} className="py-4 flex gap-4 items-center">
                    {/* Image */}
                    <img
                      src="catan.jfif"
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <p className="font-semibold text-lg word-break">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Quantity + Total */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center quantity-control gap-2">
                        <button
                          onClick={() => handleDecrease(item.id, item.quantity)}
                          className="btn-quantity"
                        >
                          –
                        </button>
                        <span className="quantity-label text-md w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="btn-quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-700 mt-1">
                        Total: €{(item.quantity * 5).toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Total Order Summary */}
              <div className="mt-6 text-right font-semibold text-lg">
                Order Total: €{getTotalPrice().toFixed(2)}
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => router.push('/checkout')}
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
        </div>
      </div>
</div>
      <Footer />
    </main>
  );
}