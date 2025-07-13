'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';

type Props = {
  productId?: string; // if undefined, modal is in cart mode
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

export default function CheckoutModal({ productId, onClose }: Props) {
  const isCartMode = !productId;
  const { items: cartItems, addItem, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [variant, setVariant] = useState('Standard');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [selectedConsumables, setSelectedConsumables] = useState<string[]>([]);

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

  const handleBuyNow = () => {
    setStep(2);
  };

  const handleAddToCart = () => {
    if (productId) {
      addItem({ id: productId, name: productId, variant });
    }
    onClose();
  };

  const submitOrder = async () => {
    const payload = {
      email,
      name,
      city,
      address,
      variant,
      consumables: selectedConsumables,
      productIds: isCartMode ? cartItems.map((p) => p.id) : [productId],
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
    <div style={{
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
                {isCartMode ? (
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
                    <h2>Select Variant</h2>
                    <select
                      className="w-full mt-2 mb-4 border rounded px-2 py-1"
                      value={variant}
                      onChange={(e) => setVariant(e.target.value)}
                    >
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Italian Edition">Italian Edition</option>
                    </select>
                    <button
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-2"
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </button>
                    <button
                      className="w-full border border-gray-400 py-2 px-4 rounded"
                      onClick={handleAddToCart}
                    >
                      Add to Cart & Continue Shopping
                    </button>
                  </>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <h2>Delivery Info</h2>
                <input className="w-full mt-2 mb-2 border rounded px-2 py-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="w-full mb-2 border rounded px-2 py-1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full mb-2 border rounded px-2 py-1" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <input className="w-full mb-4 border rounded px-2 py-1" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <button onClick={() => setStep(3)} className="w-full px-4 py-2 bg-blue-600 text-white rounded">
                  Next
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

                {isCartMode ? (
                  <ul className="mt-2 text-sm">
                    {cartItems.map((item) => (
                      <li key={item.id}>
                        • {item.name} {item.variant && `(${item.variant})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2"><strong>Product:</strong> {productId} ({variant})</p>
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