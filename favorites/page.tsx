"use client";

import { useEffect, useState } from "react";
import type { Work } from "@/app/types";

export default function FavoritesPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch("/api/favorites");
    const data = await res.json();
    setWorks(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-10">読み込み中…</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-semibold mb-10">お気に入り</h1>

        {works.length === 0 && (
          <p className="text-gray-400">まだお気に入り作品がありません。</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
            <a
              key={work.id}
              href={work.type === "internal" ? `/i/${work.short_id}` : `/work/${work.id}`}
              className="group space-y-3 block"
            >
              <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                {work.thumbnail_url ? (
                  <img
                    src={work.thumbnail_url}
                    className="w-full h-full object-cover group-hover:opacity-90 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <h2 className="text-lg font-medium truncate">{work.title}</h2>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
