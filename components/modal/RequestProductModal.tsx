'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';

type Props = {
  onClose: () => void;
};

export default function RequestProductModal({ onClose }: Props) {

const { t } = useTranslation();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("en");
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);

useEffect(() => {
  fetch("/api/categories")
    .then(res => res.json())
    .then(data => {
      const lang = typeof window !== 'undefined' && navigator.language.startsWith('it') ? 'it' : 'en';
      const localized = data.map((c: any) => ({
        slug: c.slug,
        name: t(`category_${c.slug}`) || c.name
      }));
      setCategories(localized); // just slug and name from DB
    });
}, []);

  const handleSubmit = async () => {
    const res = await fetch("/api/request-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, language, isUpcoming, email })
    });

    if (res.ok) setSubmitted(true);
    else alert("Error submitting request.");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", padding: "2rem", borderRadius: "8px",
        width: "90%", maxWidth: "400px", position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          fontSize: "1.5rem", background: "none", border: "none"
        }}>
          &times;
        </button>

        {submitted ? (
          <>
            <h2>Thanks for your request!</h2>
            <p>We’ll notify you if this product becomes available.</p>
            <button onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <h2>Request a Product</h2>
            <input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} />
<select value={category} onChange={e => setCategory(e.target.value)}>
  <option value="">Select type</option>
  {categories.map(c => (
    <option key={c.slug} value={c.slug}>
      {t(`category_${c.slug}`)}
    </option>
  ))}
</select>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="it">Italian</option>
            </select>
            <label style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
              <input type="checkbox" checked={isUpcoming} onChange={e => setIsUpcoming(e.target.checked)} />
              <span style={{ marginLeft: "0.5rem" }}>This product isn’t released yet</span>
            </label>
            <input placeholder="Your Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>Submit Request</button>
          </>
        )}
      </div>
    </div>
  );
}