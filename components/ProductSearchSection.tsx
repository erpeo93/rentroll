'use client';

import { useTranslation } from '../lib/i18n';
import CheckoutModal from './modal/CheckoutModal';
import RequestProductModal from './modal/RequestProductModal';
import { useEffect, useState } from 'react';

export default function ProductSearchSection() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
const [products, setProducts] = useState<any[]>([]);
const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
const [showRequestModal, setShowRequestModal] = useState(false);
const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
const [activeType, setActiveType] = useState<'ENTERTAINMENT' | 'CONSUMABLE'>('ENTERTAINMENT');

useEffect(() => {
  fetch(`/api/categories?type=${activeType}`)
    .then(res => res.json())
    .then(data => {
      setCategories(
        data.map((c: any) => ({
          slug: c.slug,
          name: t(`category_${c.slug}`) || c.name
        }))
      );
    });
}, [t, activeType]);

useEffect(() => {
  const q = new URLSearchParams();
  if (search) q.set("name", search);
  if (category) q.set("category", category);
 if (activeType) q.set("type", activeType);

  const url = `/api/products?${q.toString()}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      setProducts(data);

      // Live suggestions (names only)
      const uniqueNames = Array.from(new Set(data.map((p: any) => p.name))) as string[];
      setSuggestions(uniqueNames.slice(0, 5));
    });

}, [search, category, activeType]);

  return (
    <section style={{ padding: "2rem" }}>


<div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
  <div style={{
    display: "flex",
    background: "#1a1a1a",
    borderRadius: "9999px",
    padding: "0.25rem",
    border: "1px solid #333"
  }}>
    {["ENTERTAINMENT", "CONSUMABLE"].map((type) => (
      <button
        key={type}
        onClick={() => setActiveType(type as any)}
        style={{
          padding: "0.5rem 1.25rem",
          borderRadius: "9999px",
          background: activeType === type ? "#fff" : "transparent",
          color: activeType === type ? "#000" : "#ccc",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      >
        {type === "ENTERTAINMENT" ? "🎮 Entertainment" : "🍿 Consumables"}
      </button>
    ))}
  </div>
</div>


      <h2>{t("search_title")}</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "1rem" }}
        />

{search.length > 0 && suggestions.length > 0 && (
  <ul style={{ background: "#fff", padding: "0.5rem", listStyle: "none", marginTop: "0.5rem" }}>
    {suggestions.map((name) => (
      <li
        key={name}
        style={{ cursor: "pointer" }}
        onClick={() => setSearch(name)}
      >
        {name}
      </li>
    ))}
  </ul>
)}

<select value={category} onChange={(e) => setCategory(e.target.value)}>
  <option value="">All Categories</option>
  {categories.map((c) => (
    <option key={c.slug} value={c.slug}>
      {c.name}
    </option>
  ))}
</select>
      </div>


      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProductId(product.id)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "200px",
              cursor: "pointer",
              background: "#fff"
            }}
          >
            <h3>{product.name}</h3>
            <p>{t(`category_${product.category?.slug}`)}</p>
          </div>
        ))}
      </div>

<div style={{ marginTop: "2rem", textAlign: "center" }}>
  <p>Didn't find what you're looking for?</p>
  <button onClick={() => setShowRequestModal(true)}>Request a Product</button>
</div>

      {selectedProductId && (
        <CheckoutModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}

{showRequestModal && (
  <RequestProductModal onClose={() => setShowRequestModal(false)} />
)}
    </section>
  );
}