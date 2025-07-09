"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import ProductCard from "../components/ProductCard";
import SuggestionPanel from "../components/SuggestionPanel";
import { Product } from "../types/product";
import mockProducts from "../data/products.json";
import Link from "next/link";

const HomePage = () => {
  const [suggested, setSuggested] = useState<Product[]>([]);

  useEffect(() => {
    // Mock: just return first 4 items for now
    const personalized = mockProducts as Product[];
    setSuggested(personalized);
  }, []);

  return (
    <>
      <Head>
        <title>RentRoll — Rent Games, Books & More</title>
      </Head>
      <main style={{ padding: "2rem" }}>
        <h1>🎲 Welcome to RentRoll</h1>
        <p>Rent the best board games, books, films, and more. No rental fee — just pay for delivery.</p>
        
        <h2>🔮 Suggested for You</h2>
        <SuggestionPanel products={suggested} />

        <div style={{ marginTop: "2rem" }}>
          <Link href="/catalog">Browse Full Catalog →</Link>
        </div>
      </main>
    </>
  );
};

export default HomePage;