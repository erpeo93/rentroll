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
  const hasManuallySelected = useRef(false);

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
        setCategory('');
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

        if (!hasManuallySelected.current && search) {
          const uniqueNames = Array.from(new Set(data.map((p: any) => p.name))) as string[];
          setSuggestions(uniqueNames.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      });
  }, [search, category, activeType]);

  // Close filters dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFiltersDropdown(false);
      }
    }
    if (showFiltersDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFiltersDropdown]);

  return (
    <section className="p-8 min-h-[70vh] flex flex-col gap-6 text-gray-100">
      <div className="w-[95%] sm:w-[60%] bg-gray-600 mx-auto rounded-lg p-6 shadow-md border border-gray-600">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{t('our_catalog')}</h2>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 relative">

          {/* Search toggle button */}
          <button
            className="p-2 rounded-md hover:bg-gray-600 transition"
            aria-label="Toggle search"
            onClick={() => setShowSearch((v) => !v)}
          >
            <FaSearch size={18} />
          </button>

          {/* Animated search input */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${showSearch ? 'max-h-40 mt-2' : 'max-h-0'} w-full sm:w-auto`}
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
              className="rounded-md border border-gray-500 bg-gray-800 text-gray-100 p-2 w-full sm:w-auto focus:ring-2 focus:ring-indigo-500"
            />
            {search.length > 0 && suggestions.length > 0 && (
              <ul className="bg-gray-800 border border-gray-600 rounded-md max-h-40 overflow-y-auto shadow-sm z-10 mt-1 text-gray-100">
                {suggestions.map(name => (
                  <li
                    key={name}
                    onClick={() => {
                      hasManuallySelected.current = true;
                      setSearch(name);
                      setSuggestions([]);
                    }}
                    className="cursor-pointer px-3 py-1 hover:bg-indigo-700"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Filters toggle button */}
          <div className="relative" ref={filtersRef}>
            <button
              className="ml-auto sm:ml-4 p-2 rounded-md hover:bg-gray-600 transition flex items-center gap-2"
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
                className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 p-4 flex flex-col gap-4"
              >
                <select
                  value={activeType}
                  onChange={(e) => {
                    setActiveType(e.target.value as 'ENTERTAINMENT' | 'CONSUMABLE');
                    setSearch('');
                    setSuggestions([]);
                  }}
                  className="filter-select bg-gray-700 text-black border border-gray-600 rounded p-2 w-full"
                  aria-label="Select product type"
                >
                  <option value="ENTERTAINMENT">Entertainment</option>
                  <option value="CONSUMABLE">Consumables</option>
                </select>

                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="filter-select bg-gray-700 text-black border border-gray-600 rounded p-2 w-full"
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
        <main className="flex flex-wrap gap-6 justify-center">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 cursor-pointer bg-gray-800 rounded-lg border border-gray-600 p-4 scale-100 hover:scale-105 shadow-sm hover:shadow-md transition flex flex-col justify-between aspect-square transition-transform duration-300"
            >
              <img
                src={'catan.jfif'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
                loading="lazy"
              />
              <div className="mt-3">
                <h3 className="font-semibold text-base sm:text-lg lg:text-lg mb-1 truncate" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 truncate" title={t(`category_${product.category?.slug}`)}>
                  {t(`category_${product.category?.slug}`)}
                </p>
              </div>
            </div>
          ))}
        </main>
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