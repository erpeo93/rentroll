'use client';

import { useTranslation } from '../lib/i18n';
import CheckoutModal from './modal/CheckoutModal';
import RequestProductModal from './modal/RequestProductModal';
import { useEffect, useState } from 'react';
import SurpriseMeModal from './modal/SurpriseMeModal'; // adjust path if needed
import { useRouter, usePathname } from 'next/navigation';
import { useUIContext } from '@/lib/UIContext';

interface ProductSearchSectionProps {
  activeType: 'ENTERTAINMENT' | 'CONSUMABLE';
  setActiveType: (type: 'ENTERTAINMENT' | 'CONSUMABLE') => void;
}

export default function ProductSearchSection({
  activeType,
  setActiveType
}: ProductSearchSectionProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
const [products, setProducts] = useState<any[]>([]);
const [suggestions, setSuggestions] = useState<string[]>([]);
const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
const [showRequestModal, setShowRequestModal] = useState(false);
const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
const router = useRouter();

const { setShowSurpriseModal } = useUIContext();

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
{activeType === "ENTERTAINMENT" && (
  <button
    onClick={() => setShowSurpriseModal(true)}
    style={{
      marginTop: "1rem",
      backgroundColor: "#4f46e5",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
      border: "none"
    }}
  >
    🎲 {t("surprise_me") || "Surprise Me!"}
  </button>
)}
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
            onClick={() => setSelectedProduct(product)}
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
  <p>Do you have feedback for us?</p>
  <button onClick={() => router.push('/help-us-improve')}>Help Us Improve</button>
</div>

{selectedProduct && (
  <CheckoutModal
    product={selectedProduct}
    productType={selectedProduct.category?.type || 'ENTERTAINMENT'}
    onClose={() => setSelectedProduct(null)}
  />
)}
    </section>
  );
}