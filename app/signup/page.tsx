"use client";

import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const API = process.env.NEXT_PUBLIC_API_BASE;

  async function submit() {
    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      document.cookie = `token=${data.token}; path=/; max-age=2592000`;
      setMsg("Signup successful");
    } else {
      setMsg(data.error || "Signup failed");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold">Sign Up</h1>

        <input
          className="w-full p-3 bg-white/10 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 bg-white/10 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 bg-white/10 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full p-3 bg-white text-black rounded font-medium"
        >
          Create Account
        </button>

        {msg && <p className="text-sm opacity-80">{msg}</p>}
      </div>
    </main>
  );
}
