'use client';

import { useTranslation } from '../lib/i18n';
import CheckoutModal from './modal/CheckoutModal';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const router = useRouter();
  const { setShowSurpriseModal } = useUIContext();

  // Fetch categories for the active type
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
        setCategory(''); // reset category filter when activeType changes
      });
  }, [t, activeType]);

  // Fetch products on filters change
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

        // Update live suggestions (unique product names)
        const uniqueNames = Array.from(new Set(data.map((p: any) => p.name))) as string[];
        setSuggestions(uniqueNames.slice(0, 5));
      });
  }, [search, category, activeType]);

  return (
    <section className="p-8 bg-neutral-50 min-h-[70vh] flex flex-col gap-6">
      <div className="w-[100%] mx-auto bg-neutral-400 rounded-lg p-6 shadow-md">
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-neutral-800">{t('our_catalog')}</h2>
  </div>

      {/* Filters bar */}
      <div className="w-[100%] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">

        {/* Type dropdown */}
        <select
          value={activeType}
          onChange={(e) => setActiveType(e.target.value as 'ENTERTAINMENT' | 'CONSUMABLE')}
          className="filter-select"
          aria-label="Select product type"
          style={{ minWidth: 150 }}
        >
          <option value="ENTERTAINMENT">Entertainment</option>
          <option value="CONSUMABLE">Consumables</option>
        </select>

        {/* Category dropdown */}
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
          style={{ minWidth: 180 }}
        >
          <option value="">{t('all_categories') || 'All Categories'}</option>
          {categories.map(c => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Search input */}
        <div className="relative w-full sm:w-auto">
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            className="rounded-md border border-neutral-300 p-2 focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
            placeholder={t('search_placeholder') || 'Search by name'}
          />
          {/* Suggestions */}
          {search.length > 0 && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border border-neutral-300 rounded-md max-h-40 overflow-y-auto shadow-sm z-10 mt-1">
              {suggestions.map(name => (
                <li
                  key={name}
                  onClick={() => setSearch(name)}
                  className="cursor-pointer px-3 py-1 hover:bg-indigo-100"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Surprise Me button (only for Entertainment) */}
        {activeType === 'ENTERTAINMENT' && (
          <button
            onClick={() => setShowSurpriseModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-semibold transition whitespace-nowrap"
          >
            {t('surprise_me') || 'Surprise Me!'}
          </button>
        )}
      </div>

      {/* Products grid */}
<main className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
  {products.map(product => (
    <div
      key={product.id}
      onClick={() => setSelectedProduct(product)}
      className="cursor-pointer bg-white rounded-lg border border-neutral-300 p-4 scale-100 hover:scale-105 shadow-sm hover:shadow-md transition flex flex-col justify-between aspect-square transition-transform duration-300"
    >
      {/* Image container - fills available space, maintains square ratio */}
      <img
        src={'catan.jfif' /*product.imageUrl || 'catan.jfif'*/}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      {/* Text container */}
      <div className="mt-3">
        {/* Product name with responsive font size and clamp */}
        <h3 className="font-semibold text-base sm:text-lg lg:text-lg mb-1 truncate" title={product.name}>
          {product.name}
        </h3>

        {/* Category subtitle - smaller text on smaller screens */}
        <p className="text-xs sm:text-sm text-neutral-600 truncate" title={t(`category_${product.category?.slug}`)}>
          {t(`category_${product.category?.slug}`)}
        </p>
      </div>
    </div>
  ))}
</main>
      </div>

      {/* Help Us Improve */}
      <div className="mt-8 text-center">
        <p className="mb-2 text-neutral-700">Any question or feedback?</p>
        <button
          onClick={() => router.push('/help-us-improve')}
          className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Help Us Improve
        </button>
      </div>

      {/* Checkout modal */}
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