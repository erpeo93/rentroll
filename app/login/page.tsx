"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🔐 Login</h1>
      <form onSubmit={handleLogin} style={{ maxWidth: "300px" }}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit">Log In</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </main>
  );
};

export default LoginPage;