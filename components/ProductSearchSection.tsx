'use client';

import { useTranslation } from '../lib/i18n';
import CheckoutModal from './modal/CheckoutModal';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUIContext } from '@/lib/UIContext';
import { useCart } from '@/lib/cart-context';
import { FaSearch, FaFilter, FaCheck } from 'react-icons/fa';

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
  const { addItem, items } = useCart();

  const [buttonStates, setButtonStates] = useState<Record<string, 'default' | 'added' | 'goToCart'>>({});
  const animatingProducts = useRef<Set<string>>(new Set());

  const handleAddToCart = (product: any) => {
    const currentState = buttonStates[product.id];
    if (currentState === 'goToCart') {
      router.push('/cart');
      return;
    }

    addItem({ id: product.id, name: product.name, image : product.image, description : product.description });
    animatingProducts.current.add(product.id);
    setButtonStates((prev) => ({
      ...prev,
      [product.id]: 'added',
    }));

    setTimeout(() => {
      animatingProducts.current.delete(product.id);
      setButtonStates((prev) => ({
        ...prev,
        [product.id]: 'goToCart',
      }));
    }, 1000);
  };

  const [showSearch, setShowSearch] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const hasManuallySelected = useRef(false);

  // Update categories on activeType change
  useEffect(() => {
    fetch(`/api/categories?type=${activeType}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(
          data.map((c: any) => ({
            slug: c.slug,
            name: t(`category_${c.slug}`) || c.name,
          }))
        );
        setCategory('');
      });
  }, [t, activeType]);

  // Update products and suggestions on search/category/type change
  useEffect(() => {
    const q = new URLSearchParams();
    if (search) q.set('name', search);
    if (category) q.set('category', category);
    if (activeType) q.set('type', activeType);

    const url = `/api/products?${q.toString()}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        if (!hasManuallySelected.current && search) {
          const uniqueNames = Array.from(new Set(data.map((p: any) => p.name))) as string[];
          setSuggestions(uniqueNames.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      });
  }, [search, category, activeType]);

  // Click outside handlers to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFiltersDropdown(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sync button states based on cart contents and products, but skip products currently animating
  useEffect(() => {
    if (!products) return; // safeguard
    setButtonStates((prev) => {
      const newStates = { ...prev };
      const citems = items ?? []; // fallback to empty array if undefined
      for (const product of products) {
        const inCart = citems.some((item) => item.id === product.id);
        if (!animatingProducts.current.has(product.id)) {
          newStates[product.id] = inCart ? 'goToCart' : 'default';
        }
      }
      return newStates;
    });
  }, [items, products]);

  return (
    <section className="p-8 min-h-[70vh] flex flex-col gap-6 text-gray-100">
      {/* Widened container on small and medium screens */}
      <div className="w-[100%] lg:w-[80%] bg-gray-700 mx-auto rounded-lg p-6 shadow-md border border-blue-300">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">{t('our_catalog')}</h2>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center gap-4 mb-4 relative">
          <button
            ref={searchButtonRef}
            className="p-2 rounded-md hover:bg-gray-200 transition"
            onClick={() => setShowSearch((v) => !v)}
          >
            <FaSearch size={18} />
          </button>

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
                placeholder={t('search_placeholder') || 'Search by name'}
                className="rounded-md border border-gray-400 bg-white text-black p-2 w-full"
              />
              {search.length > 0 && suggestions.length > 0 && (
                <ul className="bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto shadow-sm mt-1 text-black">
                  {suggestions.map((name) => (
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

          <div className="relative" ref={filtersRef}>
            <button
              className="ml-auto sm:ml-4 p-2 rounded-md hover:bg-gray-200 transition flex items-center gap-2"
              onClick={() => setShowFiltersDropdown((v) => !v)}
            >
              <FaFilter size={18} />
              <span className="hidden sm:inline">{t('filters')}</span>
            </button>

            {showFiltersDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4 flex flex-col gap-4 text-black">
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

          {activeType === 'ENTERTAINMENT' && (
            <button
              onClick={() => setShowSurpriseModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-semibold transition"
            >
              {t('surprise_me') || 'Surprise Me!'}
            </button>
          )}
        </div>

        <main className="flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full bg-white text-gray-900 rounded-lg border border-gray-700 p-4 hover:scale-[1.001] shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-4 min-h-[200px] items-stretch"
            >
              <div className="flex flex-col md:flex-row flex-1 gap-4 min-w-0">
                <img
                  src="catan.jfif"
                  alt={product.name}
                  className="w-40 h-40 object-cover rounded-md flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex flex-col justify-start">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500">{t(`category_${product.category?.slug}`)}</p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-3">{product.description}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0 md:flex-col md:justify-end md:items-end min-w-[140px]">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={buttonStates[product.id] === 'added'}
                  className={`max-h-10 flex-1 min-w-[40%] text-sm py-2 px-4 rounded-md font-semibold transition flex items-center justify-center min-w-[120px]
                    ${
                      buttonStates[product.id] === 'default'
                        ? 'bg-gray-600 hover:bg-gray-700 text-white cursor-pointer'
                        : buttonStates[product.id] === 'added'
                        ? 'bg-green-600 cursor-default text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }
                  `}
                >
                  {buttonStates[product.id] === 'default' && 'Add to Cart'}
                  {buttonStates[product.id] === 'added' && (
                    <>
                      <FaCheck className="mr-2" /> Added!
                    </>
                  )}
                  {buttonStates[product.id] === 'goToCart' && 'Go to Cart'}
                </button>

                <button
                  onClick={() => router.push(`/product/${product.slug}`)}
                  className="max-h-10 flex-1 min-w-[40%] text-sm btn-discovery py-2 px-4 min-w-[120px] rounded-md font-semibold border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition flex justify-center"
                >
                  Discover
                </button>
              </div>
            </div>
          ))}
        </main>

        {selectedProduct && (
          <CheckoutModal
            onClose={() => setSelectedProduct(null)}
            product={selectedProduct}
          />
        )}
      </div>
    </section>
  );
}