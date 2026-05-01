"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      // 作品一覧取得
      const worksRes = await fetch(`${API}/api/works?user=${data.id}`);
      const worksData = await worksRes.json();
      setWorks(worksData);

      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  // -----------------------------
  // 2. 自動解析スコアの平均
  // -----------------------------
  const autoScores = works
    .filter((w) => w.auto)
    .map((w) => w.auto.performance);

  const avgScore =
    autoScores.length > 0
      ? Math.round(autoScores.reduce((a, b) => a + b, 0) / autoScores.length)
      : null;

  // -----------------------------
  // 3. 技術スタックの集計
  // -----------------------------
  const stackCount: Record<string, number> = {};

  works.forEach((w) => {
    w.stack.split(",").forEach((s: string) => {
      const key = s.trim();
      stackCount[key] = (stackCount[key] || 0) + 1;
    });
  });

  const sortedStacks = Object.entries(stackCount).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-12">

        {/* Header */}
        <section className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <a
            href="/submit"
            className="px-4 py-2 rounded bg-white text-black font-medium"
          >
            New Work
          </a>
        </section>

        {/* User Info */}
        <section className="space-y-2">
          <h2 className="text-xl font-medium">{user.name}</h2>
          <p className="opacity-70">{user.bio}</p>
          <a
            href="/settings"
            className="text-sm underline opacity-70 hover:opacity-100"
          >
            Edit Profile
          </a>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm opacity-70">Total Works</p>
            <p className="text-3xl font-semibold">{works.length}</p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm opacity-70">Avg Performance</p>
            <p className="text-3xl font-semibold">
              {avgScore ?? "-"}
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm opacity-70">Top Stack</p>
            <p className="text-3xl font-semibold">
              {sortedStacks[0]?.[0] ?? "-"}
            </p>
          </div>
        </section>

        {/* Works */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium">Your Works</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((w) => (
              <a
                key={w.id}
                href={`/work/${w.id}`}
                className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <div className="aspect-video bg-white/10 overflow-hidden">
                  <img
                    src={
                      w.thumbnail ??
                      "https://placehold.co/1280x720/000/FFF?text=No+Thumbnail"
                    }
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-medium">{w.title}</h3>
                  <p className="text-sm opacity-60">{w.catch}</p>

                  {w.auto && (
                    <div className="flex gap-2 text-xs opacity-80">
                      <span>Perf: {w.auto.performance}</span>
                      <span>A11y: {w.auto.a11y}</span>
                      <span>Mob: {w.auto.mobile}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
