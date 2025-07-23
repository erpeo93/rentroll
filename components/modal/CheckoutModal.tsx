'use client';

import { useState, useEffect } from 'react';
import { CartItem, useCart } from '@/lib/cart-context';
import { generateDeliverySlots, DeliverySlot } from '@/lib/delivery-slots';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { Product, ProductCategory } from "@prisma/client";
import { ModalWrapper, CloseButton } from './ModalStyles';

type ProductWithCategory = Product & {
  category?: ProductCategory;
};

type Props = {
  product?: ProductWithCategory;
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

  const itemClass = "p-4 border rounded-lg cursor-pointer";
  const selectedClass = "border-blue-500 bg-blue-50";
  const unselectedClass = "border-gray-300";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Would you like to add snacks or boosters?</h2>
      <ul className="grid gap-2">
        {consumables.map((c) => (
          <li
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`${itemClass} ${selectedIds.includes(c.id) ? selectedClass : unselectedClass}`}
          >
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-gray-600">{c.description}</p>
          </li>
        ))}
      </ul>

      <button
        onClick={onNext}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Continue
      </button>
    </div>
  );
}

export default function CheckoutModal({ product, productType, startStep, onClose }: Props) {
  const router = useRouter();
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
      addItem({ id: product.id, name: product.name, variant, price : 10 });
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
      productIds: !isBuyNow ? cartItems.map((p) => p.id) : [product!.id],
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

  // Common classes
const backdropClass = "backgroundColor: bg-black/60 fixed inset-0 flex justify-center items-center z-50";
const containerClass = "bg-white rounded-xl p-8 max-w-xl w-[90%] relative";
  const closeButtonClass = "absolute top-4 right-4 text-2xl text-gray-700 hover:text-gray-900 cursor-pointer bg-transparent border-none";
  const buttonPrimaryClass = "w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition";
  const buttonSecondaryClass = "w-full border border-gray-400 py-2 px-4 rounded hover:bg-gray-100 transition";
  const disabledButtonClass = "bg-gray-400 cursor-not-allowed text-white";

  return (
    <ModalWrapper onClose={onClose}>
      <CloseButton onClick={onClose} />
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={backdropClass}
    >
      <div className={containerClass}>

        {submitted ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">✅ Order Submitted</h2>
            <p>Thanks! We’ll notify you when available in your region.</p>
            <button onClick={onClose} className={`${buttonPrimaryClass} mt-6`}>
              Close
            </button>
          </>
        ) : (
          <>
            {step === 1 && (
              <>
                {!isBuyNow ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Cart Recap</h2>
                    <ul className="mb-6">
                      {cartItems.map((item) => (
                        <li key={item.id} className="text-sm text-gray-800 mb-1">
                          • {item.name} {item.variant && `(${item.variant})`}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => setStep(2)} className={buttonPrimaryClass}>
                      Proceed to Checkout
                    </button>
                  </>
                ) : (
                  <>
                    {product ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="text-center space-y-2 px-4">
                          <h2 className="text-2xl font-semibold">{product.name}</h2>
                          {product.category?.name && (
                            <p className="text-sm uppercase text-gray-500 tracking-wide">
                              {product.category.name}
                            </p>
                          )}

                        {product.imageUrl && (
                          <img
                            src='catan.jfif'/*{product.imageUrl}*/
                            alt={product.name}
                            className="w-full max-w-sm rounded-xl shadow-md object-contain"
                          />
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

                    {cartItems.length === 0 && (
                      <button
                        className={`${buttonPrimaryClass} mt-4`}
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </button>
                    )}

                    {productInCart ? (
                      <button
                        className={`${buttonSecondaryClass} mt-4 bg-gray-400 text-white cursor-not-allowed`}
                        onClick={onClose}
                      >
                        Item already in your cart! Go back shopping
                      </button>
                    ) : (
                      <button
                        className={`${buttonSecondaryClass} mt-4`}
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
                <h2 className="text-2xl font-semibold mb-4">Delivery Info</h2>
                <input
                  className="w-full mt-2 mb-2 border rounded px-3 py-2"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="w-full mb-2 border rounded px-3 py-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                />
                {emailTouched && !isValidEmail(email) && (
                  <p className="text-red-500 text-sm mb-2">Please enter a valid email address.</p>
                )}
                <input
                  className="w-full mb-2 border rounded px-3 py-2"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  className="w-full mb-4 border rounded px-3 py-2"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

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
                          if (!selectedSlot) return;
                          setSelectedSlot({ date: selectedSlot.date, time: e.target.value });
                        }}
                        className="p-2 border rounded w-full"
                      >
                        {slots
                          .filter((s) => s.date === selectedSlot?.date)
                          .map((s) => (
                            <option key={s.time} value={s.time}>
                              {s.time}
                            </option>
                          ))}
                      </select>
                    </div>
                  ) : (
                    <div className="mb-4 p-4 bg-yellow-100 rounded border border-yellow-300 text-yellow-800">
                      <p>Service not yet available in your city.</p>
                      <button
                        onClick={() => router.push('/help-us-improve')}
                        className={`${buttonPrimaryClass} mt-2`}
                      >
                        Help Us Improve
                      </button>
                    </div>
                  )
                )}

                <label className="inline-flex items-center mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className="mr-2"
                  />
                  <span className="text-sm">I accept the terms and conditions</span>
                </label>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className={buttonSecondaryClass}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!name || !isValidEmail(email) || !isValidAddress(address) || !termsAccepted || isAddressValidAndUnsupported}
                    className={`${buttonPrimaryClass} ${(!name || !isValidEmail(email) || !isValidAddress(address) || !termsAccepted || isAddressValidAndUnsupported) ? disabledButtonClass : ''}`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 3 && consumables.length > 0 && (
              <ExtrasStep
                consumables={consumables}
                selectedIds={selectedConsumables}
                onChange={setSelectedConsumables}
                onNext={() => setStep(4)}
              />
            )}

            {step === 4 && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Confirm Order</h2>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>City:</strong> {city}</p>
                <p><strong>Address:</strong> {address}</p>
                <p><strong>Variant:</strong> {variant}</p>
                <p><strong>Consumables:</strong> {selectedConsumables.length > 0 ? selectedConsumables.join(', ') : 'None'}</p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep(step === 4 && consumables.length > 0 ? 3 : 2)}
                    className={buttonSecondaryClass}
                  >
                    Back
                  </button>
                  <button onClick={submitOrder} className={buttonPrimaryClass}>
                    Submit Order
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
</ModalWrapper>
  );
}