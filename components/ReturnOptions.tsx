"use client";

import React, { useState } from "react";

type ReturnMethod = "next_delivery" | "in_store" | "pickup_point";

const ReturnOptions: React.FC = () => {
  const [selected, setSelected] = useState<ReturnMethod>("next_delivery");

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>🔁 Return Method</h2>
      <p>Choose how you’ll return your current items:</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
        <label>
          <input
            type="radio"
            name="returnMethod"
            value="next_delivery"
            checked={selected === "next_delivery"}
            onChange={() => setSelected("next_delivery")}
          />
          With the next delivery (default)
        </label>

        <label>
          <input
            type="radio"
            name="returnMethod"
            value="in_store"
            checked={selected === "in_store"}
            onChange={() => setSelected("in_store")}
          />
          Drop off at our store (free)
        </label>

        <label>
          <input
            type="radio"
            name="returnMethod"
            value="pickup_point"
            checked={selected === "pickup_point"}
            onChange={() => setSelected("pickup_point")}
          />
          Drop off at a pickup point (free)
        </label>
      </div>

      <p style={{ marginTop: "1rem" }}>
        Selected: <strong>{selected.replace("_", " ")}</strong>
      </p>
    </div>
  );
};

export default ReturnOptions;