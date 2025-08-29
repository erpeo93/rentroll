'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo  } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import AutocompleteInput from '@/components/AutocompleteInput';

const VALID_CITIES = ['Sangano', 'Bruino', 'Rivalta di Torino', 'Orbassano'];

const CITY_MAP: Record<string, string> = {
  Sangano: 'Sangano',
  Bruino: 'Bruino',
  Rivalta: 'Rivalta di Torino',
  Orbassano: 'Orbassano',
};

const DELIVERY_FEE = 5; // 🔹 Fixed delivery fee

function getValidDeliveryDates() {
  const result: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() === 0 && date > today) {
      // Saturday (6), only future dates (strictly > today)
      result.push(date.toISOString().slice(0, 10)); // yyyy-mm-dd
    }
  }
  return result;
}

const deliverySlots = ["18-20", "20-22"];

export default function CheckoutPage() {
  const validDates = useMemo(() => getValidDeliveryDates(), []);
  const { items, getTotalPrice, clearCart, updateQuantity } = useCart();
  const router = useRouter();

  const [showRecap, setShowRecap] = useState(false);
  const [form, setForm] = useState({
    email: '',
    city: '',
    address: '',
    phone: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (validDates.length > 0) {
      setDeliveryDate(validDates[0]);
      setDeliverySlot(deliverySlots[0]);
    }
  }, [validDates]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isSupportedCity = VALID_CITIES.includes(form.city);
  const isValidPhone = /^\d{10}$/.test(form.phone.trim());
  const isValidAddress = form.address.trim().length > 0

  const validDeliveryDates = getValidDeliveryDates();

  const isValidDelivery = 
    deliveryDate !== '' &&
    deliverySlot !== '' &&
    validDeliveryDates.includes(deliveryDate);

  const isFormValid =
    isValidEmail(form.email) &&
    isSupportedCity &&
    isValidAddress &&
    isValidDelivery &&
    isValidPhone &&
    termsAccepted;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => {
      const updatedForm = { ...prev, [field]: value };

      // Reset address if city changes
      if (field === 'city' && value !== prev.city) {
        updatedForm.address = '';
      }

      return updatedForm;
    });

    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const sendCode = async () => {
    if (!isValidPhone) {
      alert('Enter a valid 10-digit phone number first.');
      return;
    }

    const res = await fetch('/api/checkout/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone: form.phone }),
    });

    if (res.ok) {
      setCodeSent(true);
    } else {
      alert('Failed to send code.');
    }
  };

  const resendCode = () => {
    sendCode();
  };

  const handleSubmit = async () => {
    const [startHour, endHour] = deliverySlot.split('-').map(Number);
    const baseDate = new Date(deliveryDate);
    
    const deliveryWindowStart = new Date(baseDate);
    deliveryWindowStart.setHours(startHour, 0, 0, 0);

    const deliveryWindowEnd = new Date(baseDate);
    deliveryWindowEnd.setHours(endHour, 0, 0, 0);

    const res = await fetch('/api/checkout/verify-and-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        code,
        items,
        deliveryWindowStart: deliveryWindowStart.toISOString(),
        deliveryWindowEnd: deliveryWindowEnd.toISOString(),
        deliveryFee: DELIVERY_FEE, // 🔹 send total with delivery
      }),
    });

    if (res.ok) {
      clearCart();
      router.push('/checkout/thank-you');
    } else if (res.status === 409) {
      const data = await res.json();
      if (data?.items?.length) {
        for (const item of data.items) {
          updateQuantity(item.id, item.quantity, {
            adjusted: item.adjusted,
            unavailable: item.unavailable,
          });
        }
      }
      router.push('/cart?update=true');
    } else {
      alert('Invalid code or error occurred.');
    }
  };

  return (
    <main className="px-4">
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-neutral-100 shadow rounded-lg space-y-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        {/* Riassunto dell' ordine */}
        <div>
          <button
            onClick={() => setShowRecap(!showRecap)}
            className="w-full p-3 flex justify-between items-center text-left bg-gray-100 hover:bg-gray-200 rounded-t-lg"
          >
            <span className="font-medium">Riassunto dell' ordine ({items.length} articoli)</span>
            {showRecap ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showRecap && (
            <ul className="divide-y divide-gray-300 mb-6">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantità: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Delivery Info */}
        <div className="space-y-4">
          {/* Email */}
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

          {/* City */}
          <div>
            <label className="block font-medium mb-1">Città *</label>
            <select
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Seleziona il tuo paese...</option>
              {VALID_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="mt-1 text-sm">
              Non Disponibile nella tua città?
              <Link href="/help" className="text-blue-600 underline">
                Contattaci
              </Link>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-1">Indirizzo *</label>
            <AutocompleteInput
              mode="address"
              value={form.address}
              cityFilter={CITY_MAP[form.city] || form.city}
              onChange={(val) => handleChange('address', val)}
              placeholder="Digita un indirizzo..."
            />
            {form.address.trim().length === 0 && touched.address && (
              <p className="text-red-600 text-sm mt-1">Address is required.</p>
            )}
          </div>

          {form.city && form.address && (
            <div className="mt-4 space-y-4">
              {/* Delivery Date Selector */}
              <div>
                <label className="block font-medium mb-1">Data di Consegna *</label>
                <select
                  className="w-full px-4 py-2 border rounded"
                  value={deliveryDate}
                  onChange={(e) => {
                    setDeliveryDate(e.target.value);
                    setDeliverySlot(deliverySlots[0]); // Reset slot when date changes
                  }}
                >
                  {getValidDeliveryDates().map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString("it-IT", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Time Slot Selector */}
              {deliveryDate && (
                <div>
                  <label className="block font-medium mb-1">Fascia Oraria *</label>
                  <select
                    className="w-full px-4 py-2 border rounded"
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                  >
                    <option value="18-20">18:00 - 20:00</option>
                    <option value="20-22">20:00 - 22:00</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="block font-medium mb-1">Numero di Telefono *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {!isValidPhone && touched.phone && (
              <p className="text-red-600 text-sm mt-1">Enter a valid 10-digit phone number.</p>
            )}
            {!codeSent && isValidPhone && (
              <button
                onClick={sendCode}
                className="mt-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Invia SMS di verifica
              </button>
            )}
          </div>

          {/* Codice di verifica */}
          {codeSent && (
            <div>
              <label className="block font-medium mb-1">Codice di Verifica *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <button
                className="mt-2 text-sm text-blue-600 underline"
                onClick={resendCode}
              >
                Invia di nuovo
              </button>
            </div>
          )}
        </div>

        {/* Order Total */}
        <div className="text-xl font-semibold text-right space-y-1">
          <div>Subtotale: €{getTotalPrice().toFixed(2)}</div>
          <div className="text-s font-normal">Consegna: €{DELIVERY_FEE.toFixed(2)}</div>
          <div className="border-t pt-2">
            Totale: €{(getTotalPrice() + DELIVERY_FEE).toFixed(2)}
          </div>
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
            <label>Accetto I <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline"> Termini e Condizioni </Link> *</label>
          </div>

          <div className="flex items-center">
            <input type="checkbox" disabled checked readOnly className="mr-2" />
            <label>Paghero' alla consegna in contanti o con satispay</label>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || !codeSent || code.length === 0}
          className={`w-full py-3 text-white font-semibold rounded ${
            isFormValid && codeSent && code.length > 0
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Conferma Ordine
        </button>
      </div>

      <Footer />
    </main>
  );
}