"use client";

import React from "react";
import ProductCard from "../../components/ProductCard";
import { Product } from "../../types/product";
import ReturnOptions from "../../components/ReturnOptions";

// TEMP: mock data for testing
const mockHeldItems: Product[] = [
  {
    id: "p001",
    name: "Catan",
    category: "board game",
    value: 35
  },
  {
    id: "p004",
    name: "Inception",
    category: "film",
    value: 18
  }
];

const DashboardPage = () => {
  const heldValue = mockHeldItems.reduce((sum, item) => sum + item.value, 0);
  const nextDelivery = "Monday, July 15 at 10:00 AM";
  const balance = 4; // Delivery credits remaining

  return (
    <main style={{ padding: "2rem" }}>
      <h1>📦 Your Dashboard</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>🛒 Items You’re Holding</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {mockHeldItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
        <p style={{ marginTop: "1rem" }}>Total value held: <strong>${heldValue}</strong></p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>🚚 Next Delivery</h2>
        <p>Scheduled for: <strong>{nextDelivery}</strong></p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>💳 Your Balance</h2>
        <p>You have <strong>{balance}</strong> delivery credits remaining.</p>
      </section>

      <ReturnOptions />
    </main>
  );
};

export default DashboardPage;