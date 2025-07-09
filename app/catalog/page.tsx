"use client";

import React from "react";
import ProductCard from "../../components/ProductCard";
import mockProducts from "../../data/products.json";
import { Product } from "../../types/product";

const CatalogPage = () => {
  const products = mockProducts as Product[];

  return (
    <main style={{ padding: "2rem" }}>
      <h1>📚 Full Catalog</h1>
      <p>Browse all available entertainment products to rent.</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default CatalogPage;