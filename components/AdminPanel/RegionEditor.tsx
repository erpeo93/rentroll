"use client";

import React, { useState } from "react";

type Region = {
  city: string;
  isActive: boolean;
  deliveryDays: string[];
  provider: "first_party" | "glovo";
};

const mockRegions: Region[] = [
  {
    city: "Barcelona",
    isActive: true,
    deliveryDays: ["Monday", "Wednesday", "Friday"],
    provider: "first_party"
  },
  {
    city: "Mataró",
    isActive: true,
    deliveryDays: ["Tuesday", "Thursday"],
    provider: "glovo"
  },
  {
    city: "Girona",
    isActive: false,
    deliveryDays: [],
    provider: "glovo"
  }
];

const RegionEditor: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>(mockRegions);

  const toggleActive = (city: string) => {
    setRegions(prev =>
      prev.map(r => r.city === city ? { ...r, isActive: !r.isActive } : r)
    );
  };

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>🌍 Delivery Regions</h2>
      {regions.map(region => (
        <div key={region.city} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>{region.city}</h3>
          <p>Status: <strong>{region.isActive ? "Active" : "Inactive"}</strong></p>
          <p>Delivery Days: {region.deliveryDays.length > 0 ? region.deliveryDays.join(", ") : "N/A"}</p>
          <p>Provider: {region.provider}</p>
          <button onClick={() => toggleActive(region.city)}>
            {region.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      ))}
    </section>
  );
};

export default RegionEditor;