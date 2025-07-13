'use client';

import { useState, useEffect } from 'react';

type Props = {
  productId: string;
  onClose: () => void;
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
  selectedIds: String[];
  onChange: (ids: String[]) => void;
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
  const [step, setStep] = useState(1);
  const [variant, setVariant] = useState("Standard");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [selectedConsumables, setSelectedConsumables] = useState<String[]>([]);

  useEffect(() => {
    // Preload consumables when component mounts
    fetch('/api/products?type=CONSUMABLE')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setConsumables(data);
        }
      });
  }, []);

  useEffect(() => {
    // Auto-skip extras step if no consumables are available
    if (step === 3 && consumables.length === 0) {
      setStep(4);
    }
  }, [step, consumables]);

  const submitOrder = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        city,
        address,
        productId,
        variant,
        consumables: selectedConsumables.map(c => c)
      })
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "2rem",
        maxWidth: "400px",
        width: "90%",
        position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#333"
          }}
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          <>
            <h2>✅ Order Submitted</h2>
            <p>Thanks! We’ll notify you when available in your region.</p>
            <button onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            {step === 1 && (
              <>
                <h2>Select Variant</h2>
                <select value={variant} onChange={(e) => setVariant(e.target.value)}>
                  <option>Standard</option>
                  <option>Deluxe</option>
                  <option>Italian Edition</option>
                </select>
                <button onClick={() => setStep(2)}>Next</button>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Delivery Info</h2>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <button onClick={() => setStep(3)}>Next</button>
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
                <p><strong>Product:</strong> {productId}</p>
                <p><strong>Variant:</strong> {variant}</p>

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

                <p><strong>To:</strong> {name}, {email}, {address}, {city}</p>

                <div style={{ marginTop: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      style={{ marginRight: "0.5rem" }}
                    />
                    I accept the&nbsp;
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0070f3", textDecoration: "underline" }}
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <button onClick={() => setStep(2)}>Back</button>
                  <button
                    onClick={submitOrder}
                    disabled={!termsAccepted}
                    style={{ marginLeft: "1rem", opacity: termsAccepted ? 1 : 0.5 }}
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