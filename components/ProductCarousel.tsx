'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';
import CheckoutModal from './modal/CheckoutModal';


export default function ProductCarousel() {
  const { t } = useTranslation();
const [selectedProduct, setSelectedProduct] = useState<{ id: string; type: string } | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products/hot')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <section style={{ padding: "2rem" }}>
      <h2>{t("hot_products") ?? "Hot Picks"}</h2>
      <div style={{
        display: "flex",
        overflowX: "auto",
        gap: "1rem",
        padding: "1rem 0"
      }}>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              minWidth: "200px",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#fff",
              cursor: "pointer"
            }}
            onClick={() => setSelectedProduct({ id: product.id, type: product.category?.type })}
          >
            <h3>{product.name}</h3>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <CheckoutModal
          productId={selectedProduct.id}
	productType={selectedProduct.type}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}