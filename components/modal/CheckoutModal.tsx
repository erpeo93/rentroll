'use client';

import { useState, useEffect } from 'react';
import { CartItem, useCart  } from '@/lib/cart-context';
import { generateDeliverySlots, DeliverySlot } from '@/lib/delivery-slots';
import { useTranslation } from '@/lib/i18n';

type Props = {
  product?: {
    id: string;
    name: string;
    imageUrl: string;
    description?: string;
    category?: { name: string };
  };
  productType?: string;
  startStep?: number;
  onClose: () => void;
};

type ProductSummary = {
  id: string;
  name: string;
  variant?: string;
};

type Consumable = {
  id: string;
  name: string;
  description: string;
  image?: string;
  language: string;
};

function isValidAddress(address: string): boolean {
  const hasNumber = /\d/.test(address);
  const hasWord = /[a-zA-Z]/.test(address);
  return address.trim().length >= 10 && hasNumber && hasWord;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ExtrasStep({
  consumables,
  selectedIds,
  onChange,
  onNext,
}: {
  consumables: Consumable[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onNext: () => void;
}) {
  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter(x => x !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Would you like to add snacks or boosters?</h2>
      <ul className="grid gap-2">
        {consumables.map((c) => (
          <li
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedIds.includes(c.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-gray-600">{c.description}</p>
          </li>
        ))}
      </ul>

      <button onClick={onNext} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Continue
      </button>
    </div>
  );
}

export default function CheckoutModal({ product, productType, startStep, onClose }: Props) {

  const isBuyNow = !!product;
  const { items: cartItems, addItem, clearCart } = useCart();
const { t } = useTranslation();

  const [variant, setVariant] = useState('Standard');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [selectedConsumables, setSelectedConsumables] = useState<string[]>([]);
const [slots, setSlots] = useState<DeliverySlot[]>([]);
const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null);
const [step, setStep] = useState(startStep ?? 1);
const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    fetch('/api/products?type=CONSUMABLE')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setConsumables(data);
      });
  }, []);

  useEffect(() => {
    if (step === 3 && consumables.length === 0) {
      setStep(4);
    }
  }, [step, consumables]);

useEffect(() => {
  const s = generateDeliverySlots();
  setSlots(s);
  setSelectedSlot(s[0] ?? null); // earliest available
}, []);

  const handleBuyNow = () => {
    setStep(2);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({ id: product.id, name: product.name, variant });
    }
    onClose();
  };

  const productInCart =
    productType === 'ENTERTAINMENT' &&
    product &&
    cartItems.some((item) => item.id === product.id);

const isSupportedCity = ['Rome', 'Milan', 'Florence'].includes(city);
const isAddressValidAndUnsupported = isValidAddress(address) && !isSupportedCity;

  const submitOrder = async () => {
    const payload = {
      email,
      name,
      city,
      address,
      variant,
      consumables: selectedConsumables,
      productIds: !isBuyNow ? cartItems.map((p) => p.id) : [product.id],
    };

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSubmitted(true);
      clearCart();
    } else {
      alert('Something went wrong.');
    }
  };

  return (
    <div 
  onClick={(e) => {
    if (e.target === e.currentTarget) onClose();
  }}
style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#333'
          }}
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          <>
            <h2>✅ Order Submitted</h2>
            <p>Thanks! We’ll notify you when available in your region.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Close</button>
          </>
        ) : (
          <>
            {step === 1 && (
              <>
                {!isBuyNow ? (
                  <>
                    <h2 className="text-xl font-semibold mb-2">Cart Recap</h2>
                    <ul className="mb-4">
                      {cartItems.map((item) => (
                        <li key={item.id} className="text-sm text-gray-800">
                          • {item.name} {item.variant && `(${item.variant})`}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setStep(2)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Proceed to Checkout
                    </button>
                  </>
                ) : (
                  <>
{product ? (
  <div className="flex flex-col items-center gap-6">
    <img
      src={product.imageUrl}
      alt={product.name}
      className="w-full max-w-sm rounded-xl shadow-md object-contain"
    />

    <div className="text-center space-y-2">
      <h2 className="text-2xl font-semibold">{product.name}</h2>
      {product.category?.name && (
        <p className="text-sm uppercase text-gray-500 tracking-wide">
          {product.category.name}
        </p>
      )}
      {product.description && (
        <p className="text-gray-700 text-base max-w-md mx-auto leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      )}
    </div>
  </div>
) : (
  <p>Loading product details...</p>
)}

{cartItems.length === 0 ? (
                    <button
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-2"
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </button>
) : (null)}

{productInCart ? (
  <button
    className="bg-gray-400 text-white px-4 py-2 rounded"
    onClick={onClose}
  >
    Item already in your cart! Go back shopping
  </button>
) : (
                    <button
                      className="w-full border border-gray-400 py-2 px-4 rounded"
                      onClick={handleAddToCart}
                    >
                      Add to Cart & Continue Shopping
                    </button>
)}
                  </>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <h2>Delivery Info</h2>
                <input className="w-full mt-2 mb-2 border rounded px-2 py-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
<input
  className="w-full mb-2 border rounded px-2 py-1"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={() => setEmailTouched(true)}
/>
{emailTouched && !isValidEmail(email) && (
  <p className="text-red-500 text-sm mb-2">Please enter a valid email address.</p>
)}                
                <input className="w-full mb-2 border rounded px-2 py-1" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <input className="w-full mb-4 border rounded px-2 py-1" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
{isValidAddress(address) && (
isSupportedCity ? (
  <div className="mb-4">
    <label className="block font-semibold mb-2">Choose a Delivery Slot</label>
    <select
      value={selectedSlot?.date}
      onChange={(e) => {
        const newDate = e.target.value;
        const firstTime = slots.find((s) => s.date === newDate);
        if (firstTime) setSelectedSlot(firstTime);
      }}
      className="mb-2 p-2 border rounded w-full"
    >
      {[...new Set(slots.map(s => s.date))].map(date => (
        <option key={date} value={date}>{date}</option>
      ))}
    </select>

    <select
      value={selectedSlot?.time}
      onChange={(e) => {
        const newSlot = slots.find(
          (s) => s.date === selectedSlot?.date && s.time === e.target.value
        );
        if (newSlot) setSelectedSlot(newSlot);
      }}
      className="p-2 border rounded w-full"
    >
      {slots
        .filter(s => s.date === selectedSlot?.date)
        .map(s => (
          <option key={s.time} value={s.time}>{s.time}</option>
        ))}
    </select>
  </div>  
) : (
    <div className="text-center">
      <p>Sorry, our service isn't available in your city yet.</p>
    </div>
)              
)}
<button onClick={() => {
    if (isAddressValidAndUnsupported) {
      //router.push('/help-us-improve');
    } else {
      setStep(3);
    }
	}
} disabled={!isValidEmail(email) || !isValidAddress(address)} className="w-full px-4 py-2 bg-blue-600 text-white rounded">
                  {isAddressValidAndUnsupported ? 'Help us Improve' : 'Next'}
                </button>
              </>
            )}

            {step === 3 && (
              <ExtrasStep
                consumables={consumables}
                selectedIds={selectedConsumables}
                onChange={setSelectedConsumables}
                onNext={() => setStep(4)}
              />
            )}

            {step === 4 && (
              <>
                <h2>Confirm Order</h2>

                {!isBuyNow ? (
                  <ul className="mt-2 text-sm">
                    {cartItems.map((item) => (
                      <li key={item.id}>
                        • {item.name} {item.variant && `(${item.variant})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2"><strong>Product:</strong> {product.id} ({variant})</p>
                )}

                {selectedConsumables.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">Extras selected:</h3>
                    <ul className="list-disc ml-6 mt-1 text-sm text-gray-700">
                      {consumables
                        .filter((c) => selectedConsumables.includes(c.id))
                        .map((c) => (
                          <li key={c.id}>{c.name}</li>
                        ))}
                    </ul>
                  </div>
                )}

                <p className="mt-4 text-sm text-gray-600">
                  <strong>To:</strong> {name}, {email}, {address}, {city}
                </p>

                <div className="mt-4 text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mr-2"
                    />
                    I accept the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
                      Terms and Conditions
                    </a>
                  </label>
                </div>

                <div className="mt-4 flex justify-between">
                  <button onClick={() => setStep(2)} className="text-sm text-gray-600 underline">Back</button>
                  <button
                    onClick={submitOrder}
                    disabled={!termsAccepted}
                    className={`px-4 py-2 rounded text-white ${termsAccepted ? 'bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}