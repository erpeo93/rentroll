"use client";

import React from "react";
import mockUsers from "../../data/users.json"; // placeholder for user data
import { Product } from "../../types/product";
import DeliveryTracker from "../../components/AdminPanel/DeliveryTracker";
import RegionEditor from "../../components/AdminPanel/RegionEditor";

type User = {
  id: string;
  name: string;
  city: string;
  balance: number;
  holdings: Product[];
};

const AdminPanel = () => {
  const users = mockUsers as User[];

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🛠️ Admin Panel</h1>
      <p>Monitor users, deliveries, and holdings.</p>

      <section style={{ marginTop: "2rem" }}>
        <h2>👥 Users & Holdings</h2>
        {users.map((user) => (
          <div key={user.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <h3>{user.name} ({user.city})</h3>
            <p>Balance: {user.balance} credits</p>
            <p>Items Held:</p>
            <ul>
              {user.holdings.map((item) => (
                <li key={item.id}>{item.name} (${item.value})</li>
              ))}
            </ul>
            <p>Total Value Held: ${user.holdings.reduce((sum, i) => sum + i.value, 0)}</p>
          </div>
        ))}
      </section>
      <DeliveryTracker />
      <RegionEditor />
    </main>
  );
};

export default AdminPanel;