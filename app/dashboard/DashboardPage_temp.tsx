"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch("/api/me/stats", { credentials: "include" });
    const data = await res.json();
    setStats(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-16">
        読み込み中…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-3xl font-semibold">ダッシュボード</h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <p className="text-gray-400 text-sm">総作品数</p>
            <p className="text-3xl font-bold">{stats.totalWorks}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <p className="text-gray-400 text-sm">総いいね数</p>
            <p className="text-3xl font-bold">{stats.totalLikes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
