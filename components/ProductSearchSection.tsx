'use client';

import { useTranslation } from '../lib/i18n';
import CheckoutModal from './modal/CheckoutModal';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUIContext } from '@/lib/UIContext';
import { FaSearch, FaFilter } from 'react-icons/fa';

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

  const [showSearch, setShowSearch] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const hasManuallySelected = useRef(false);

  // Fetch categories
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
        setCategory('');
      });
  }, [t, activeType]);

  // Fetch products
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

        if (!hasManuallySelected.current && search) {
          const uniqueNames = Array.from(new Set(data.map((p: any) => p.name))) as string[];
          setSuggestions(uniqueNames.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      });
  }, [search, category, activeType]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFiltersDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="p-8 min-h-[70vh] flex flex-col gap-6 text-gray-100">
      <div className="w-[95%] sm:w-[60%] bg-gray-700 mx-auto rounded-lg p-6 shadow-md border border-blue-300">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">{t('our_catalog')}</h2>
        </div>

        {/* Top bar */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-4 mb-4 relative">
          {/* Search Button */}
          <button
            className="p-2 rounded-md hover:bg-gray-200 transition"
            aria-label="Toggle search"
            onClick={() => setShowSearch((v) => !v)}
          >
            <FaSearch size={18} />
          </button>

          {/* Search Modal */}
          {showSearch && (
            <div
              ref={searchRef}
              className="absolute top-full mt-2 w-full sm:w-72 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-3"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  hasManuallySelected.current = false;
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSuggestions([]);
                    hasManuallySelected.current = true;
                  }
                }}
                autoComplete="off"
                placeholder={t('search_placeholder') || 'Search by name'}
                className="rounded-md border border-gray-400 bg-white text-black p-2 w-full focus:ring-2 focus:ring-indigo-500"
              />
              {search.length > 0 && suggestions.length > 0 && (
                <ul className="bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto shadow-sm z-10 mt-1 text-black">
                  {suggestions.map(name => (
                    <li
                      key={name}
                      onClick={() => {
                        hasManuallySelected.current = true;
                        setSearch(name);
                        setSuggestions([]);
                      }}
                      className="cursor-pointer px-3 py-1 hover:bg-indigo-100"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Filter Toggle */}
          <div className="relative" ref={filtersRef}>
            <button
              className="ml-auto sm:ml-4 p-2 rounded-md hover:bg-gray-200 transition flex items-center gap-2"
              onClick={() => setShowFiltersDropdown((v) => !v)}
              aria-expanded={showFiltersDropdown}
              aria-controls="filters-dropdown"
            >
              <FaFilter size={18} />
              <span className="hidden sm:inline">{t('filters')}</span>
            </button>

            {showFiltersDropdown && (
              <div
                id="filters-dropdown"
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4 flex flex-col gap-4 text-black"
              >
                <select
                  value={activeType}
                  onChange={(e) => {
                    setActiveType(e.target.value as 'ENTERTAINMENT' | 'CONSUMABLE');
                    setSearch('');
                    setSuggestions([]);
                  }}
                  className="bg-gray-100 border border-gray-300 rounded p-2 w-full"
                >
                  <option value="ENTERTAINMENT">Entertainment</option>
                  <option value="CONSUMABLE">Consumables</option>
                </select>

                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-gray-100 border border-gray-300 rounded p-2 w-full"
                >
                  <option value="">{t('all_categories') || 'All Categories'}</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Surprise Me Button */}
          {activeType === 'ENTERTAINMENT' && (
            <button
              onClick={() => setShowSurpriseModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-semibold transition whitespace-nowrap"
            >
              {t('surprise_me') || 'Surprise Me!'}
            </button>
          )}
        </div>

        {/* Products */}
        <main className="flex flex-col gap-3">
{products.map(product => (
  <div
    key={product.id}
    className="w-full bg-white text-gray-900 rounded-lg border border-gray-700 p-4 hover:scale-[1.02] shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-4 min-h-[200px]"
  >
    {/* Left section: image + info */}
    <div className="flex flex-col sm:flex-row flex-1 gap-4">
      <img
        src="catan.jfif"
        alt={product.name}
        className="w-40 h-40 object-cover rounded-md"
        loading="lazy"
      />
      <div className="flex flex-col justify-start">
        <h3 className="font-semibold text-lg mb-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-sm text-gray-500" title={t(`category_${product.category?.slug}`)}>
          {t(`category_${product.category?.slug}`)}
        </p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{product.description}</p>
      </div>
    </div>

    {/* Right section: buttons aligned to bottom of image */}
    <div className="flex flex-col justify-end min-w-[140px] h-40">
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
        onClick={() => setSelectedProduct(product)}
      >
        {t('add_to_cart') || 'Add to Cart'}
      </button>
      <button
        className="btn-discovery bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm mt-2"
        onClick={() => setSelectedProduct(product)}
      >
        {t('discover') || 'Discover'}
      </button>
    </div>
  </div>
))}
        </main>
      </div>

      {/* Checkout Modal */}
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