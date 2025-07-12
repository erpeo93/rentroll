'use client';

import { useState } from 'react';


type Props = {
  productId: string;
  onClose: () => void;
};

export default function CheckoutModal({ productId, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [variant, setVariant] = useState("Standard");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const submitOrder = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, city, address, productId, variant })
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
  <>
    <h2>Confirm Order</h2>
    <p><strong>Product:</strong> {productId}</p>
    <p><strong>Variant:</strong> {variant}</p>
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