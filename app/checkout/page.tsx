'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

const VALID_CITIES = ['Milan', 'Rome', 'Florence', 'Turin'];

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCart();
  const router = useRouter();

  const [showRecap, setShowRecap] = useState(true);
  const [form, setForm] = useState({ email: '', city: '', address: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isSupportedCity = VALID_CITIES.includes(form.city.trim());
  const isFormValid =
    isValidEmail(form.email) &&
    form.city.trim().length > 0 &&
    form.address.trim().length > 0 &&
    termsAccepted;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    alert('Order confirmed!');
    // Add API call or redirect here
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-neutral-100 shadow rounded-lg space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Order Recap */}
      <div>
        <button
          onClick={() => setShowRecap(!showRecap)}
          className="w-full p-3 flex justify-between items-center text-left bg-gray-100 hover:bg-gray-200 rounded-t-lg"
        >
          <span className="font-medium">Order Recap ({items.length} items)</span>
          {showRecap ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showRecap && (
          <ul className="divide-y divide-gray-300 mb-6">
            {items.map((item) => (
              <li key={item.id} className="py-4 flex gap-4 items-center">
                <img
                  src="catan.jfif"
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delivery Info */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {!isValidEmail(form.email) && touched.email && (
            <p className="text-red-600 text-sm mt-1">Please enter a valid email.</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">City *</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {form.city && !isSupportedCity && (
            <div className="mt-1 text-sm text-red-600">
              Sorry! Our service is not available in your city!
              <div className="mt-1">
                <Link href="/help" className="text-blue-600 underline">
                  Let us know
                </Link>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Address *</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {form.address.trim().length === 0 && touched.address && (
            <p className="text-red-600 text-sm mt-1">Address is required.</p>
          )}
        </div>
      </div>

      {/* Order Total */}
      <div className="text-xl font-semibold text-right">
        Total: €{getTotalPrice().toFixed(2)}
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mr-2"
          />
          <label>I accept the terms and conditions *</label>
        </div>

        <div className="flex items-center">
          <input type="checkbox" disabled checked readOnly className="mr-2" />
          <label>I will pay at the delivery with cash or other digital payments</label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || !isSupportedCity}
        className={`w-full py-3 text-white font-semibold rounded ${
          isFormValid && isSupportedCity
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Confirm Order
      </button>
    </div>
  );
}