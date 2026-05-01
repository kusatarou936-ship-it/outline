"use client";

import { useEffect, useState } from "react";

export default function EditWorkPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [work, setWork] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

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
    }

    fetchUser();
  }, []);

  // -----------------------------
  // 2. 作品データ取得
  // -----------------------------
  useEffect(() => {
    async function fetchWork() {
      const res = await fetch(`${API}/api/work/${params.id}`);
      const data = await res.json();
      setWork(data);
    }

    fetchWork();
  }, [params.id]);

  // -----------------------------
  // 3. 保存処理
  // -----------------------------
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const res = await fetch(`${API}/api/work/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (res.ok) {
      window.location.href = `/work/${params.id}`;
    } else {
      alert("Error");
    }

    setLoading(false);
  }

  if (!work || !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  // 自分の作品でなければ拒否
  if (work.user_id !== user.id) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>You cannot edit this work</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-2xl font-semibold">Edit Work</h1>

        <form onSubmit={save} className="space-y-6">
          <Input name="id" value={work.id} hidden />

          <Input name="title" label="Title" defaultValue={work.title} required />
          <Input name="catch" label="Catch" defaultValue={work.catch} required />
          <Input name="url" label="URL" defaultValue={work.url} required />
          <Input name="purpose" label="Purpose" defaultValue={work.purpose} required />
          <Input name="target" label="Target" defaultValue={work.target} required />
          <Input name="focus" label="Focus" defaultValue={work.focus} required />
          <Input name="stack" label="Stack" defaultValue={work.stack} required />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-medium"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Input({
  name,
  label,
  defaultValue,
  required,
  hidden,
}: {
  name: string;
  label?: string;
  defaultValue?: string;
  required?: boolean;
  hidden?: boolean;
}) {
  if (hidden) {
    return <input type="hidden" name={name} value={defaultValue} />;
  }

  return (
    <div className="space-y-2">
      <label className="text-sm opacity-80">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
      />
    </div>
  );
}
