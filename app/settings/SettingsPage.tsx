"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState("");
  const [msg, setMsg] = useState("");

  const API =
    process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8787";

  // -----------------------------
  // 1. ログイン状態を取得
  // -----------------------------
  useEffect(() => {
    async function fetchUser() {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setUser(data);
      setName(data.name);
      setBio(data.bio);
      setLinks(data.links);
    }

    fetchUser();
  }, []);

  // -----------------------------
  // 2. 更新処理
  // -----------------------------
  async function save() {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const res = await fetch(`${API}/api/user/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, bio, links }),
    });

    if (res.ok) {
      setMsg("Saved");
    } else {
      setMsg("Error");
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-xl space-y-8">
        <h1 className="text-2xl font-semibold">Settings</h1>

        <div className="space-y-4">
          <label className="text-sm opacity-80">Name</label>
          <input
            className="w-full p-3 rounded bg-white/10 border border-white/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="text-sm opacity-80">Bio</label>
          <textarea
            className="w-full p-3 rounded bg-white/10 border border-white/20"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <label className="text-sm opacity-80">Links (comma separated)</label>
          <input
            className="w-full p-3 rounded bg-white/10 border border-white/20"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
          />

          <button
            onClick={save}
            className="w-full py-3 rounded bg-white text-black font-medium"
          >
            Save
          </button>

          {msg && <p className="text-sm opacity-80">{msg}</p>}
        </div>
      </div>
    </main>
  );
}
