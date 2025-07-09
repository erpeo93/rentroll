"use client";

import React from "react";

type Delivery = {
  id: string;
  user: string;
  date: string;
  method: "first_party" | "glovo";
  city: string;
  returning: string[];
};

const mockDeliveries: Delivery[] = [
  {
    id: "d001",
    user: "Alice Johnson",
    date: "2025-07-15T10:00:00",
    method: "first_party",
    city: "Barcelona",
    returning: ["Catan", "Inception"]
  },
  {
    id: "d002",
    user: "Carlos Vega",
    date: "2025-07-16T14:00:00",
    method: "glovo",
    city: "Mataró",
    returning: ["The Hobbit"]
  }
];

const DeliveryTracker: React.FC = () => {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>🚚 Scheduled Deliveries</h2>
      {mockDeliveries.map((d) => (
        <div key={d.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>{d.user} — {d.city}</h3>
          <p>📅 {new Date(d.date).toLocaleString()}</p>
          <p>Method: <strong>{d.method === "first_party" ? "First-party" : "Glovo"}</strong></p>
          <p>Returning: {d.returning.join(", ")}</p>
        </div>
      ))}
    </section>
  );
};

export default DeliveryTracker;