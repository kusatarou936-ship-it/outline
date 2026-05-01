"use client";

import { useState, useEffect } from "react";

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

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

      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8787";

      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setUser(data);
    }

    fetchUser();
  }, []);

  // -----------------------------
  // 2. 投稿処理
  // -----------------------------
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (!user?.id) {
      alert("User not loaded");
      setLoading(false);
      return;
    }

    const form = new FormData(e.currentTarget);

    // user_id を自動付与
    form.append("user_id", String(user.id));

    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8787";

    const res = await fetch(`${API_BASE}/api/work`, {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      const { id } = await res.json();
      window.location.href = `/work/${id}`;
    } else {
      alert("Error");
    }

    setLoading(false);
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold mb-10">Submit Work</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input name="title" label="Title" required />
          <Input name="catch" label="Catch" required />
          <Input name="url" label="URL" required />
          <Input name="purpose" label="Purpose" required />
          <Input name="target" label="Target" required />
          <Input name="focus" label="Focus" required />
          <Input name="stack" label="Stack (comma separated)" required />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl bg-white/10 border border-white/20
              hover:bg-white/20 transition
            "
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Input({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm opacity-80">{label}</label>
      <input
        name={name}
        required={required}
        className="
          w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
          outline-none focus:border-white/20 transition
        "
      />
    </div>
  );
}
