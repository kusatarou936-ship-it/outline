"use client";

import { useEffect, useState } from "react";
import type { Work } from "@/app/types";

export default function MePage() {
  const [internal, setInternal] = useState<Work[]>([]);
  const [external, setExternal] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch("/api/me/works");
    const data = await res.json();
    setInternal(data.internal);
    setExternal(data.external);
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
      <div className="max-w-5xl mx-auto space-y-16">

        {/* 作者名 */}
        <header>
          <h1 className="text-3xl font-semibold">あなたの作品</h1>
        </header>

        {/* 内部生成作品 */}
        <section>
          <h2 className="text-xl font-medium mb-6">内部生成作品</h2>

          {internal.length === 0 && (
            <p className="text-gray-400">まだ内部生成作品がありません。</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {internal.map((work) => (
              <a
                key={work.id}
                href={`/i/${work.short_id}`}
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

                <h3 className="text-lg font-medium truncate">{work.title}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(work.created_at).toLocaleDateString("ja-JP")}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* 外部URL作品 */}
        <section>
          <h2 className="text-xl font-medium mb-6">外部URL作品</h2>

          {external.length === 0 && (
            <p className="text-gray-400">まだ外部URL作品がありません。</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {external.map((work) => (
              <a
                key={work.id}
                href={`/work/${work.id}`}
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

                <h3 className="text-lg font-medium truncate">{work.title}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(work.created_at).toLocaleDateString("ja-JP")}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
