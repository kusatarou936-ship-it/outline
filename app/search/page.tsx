"use client";

import { useState } from "react";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API =
    process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8787";

  async function search() {
    setLoading(true);

    const res = await fetch(
      `${API}/api/search?keyword=${encodeURIComponent(keyword)}`
    );

    const data = await res.json();
    setResults(data);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-10">

        <h1 className="text-3xl font-semibold">Search</h1>

        <div className="flex gap-4">
          <input
            className="flex-1 p-3 rounded bg-white/10 border border-white/20"
            placeholder="Search by title, stack, user..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            onClick={search}
            className="px-6 py-3 rounded bg-white text-black font-medium"
          >
            Search
          </button>
        </div>

        {loading && <p>Searching...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((w) => (
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
      </div>
    </main>
  );
}
