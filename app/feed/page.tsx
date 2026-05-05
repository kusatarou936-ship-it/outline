"use client";

import { useEffect, useState } from "react";

export default function FeedPage() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch("/api/home/works");
    const data = await res.json();
    setWorks(data);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-semibold mb-10">作品一覧</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
            <a
              key={work.id}
              href={`/work/${work.id}`}
              className="group space-y-3 block"
            >
              {/* サムネイル */}
              <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <img
                  src={work.thumbnail_url}
                  className="w-full h-full object-cover group-hover:opacity-90 transition"
                  alt="thumbnail"
                />
              </div>

              {/* タイトル */}
              <h2 className="text-lg font-medium truncate">
                {work.title}
              </h2>

              {/* 作者 */}
              <p className="text-gray-500 text-sm">
                {work.author_name ?? "匿名"}
              </p>

              {/* タグ */}
              <div className="flex gap-2 flex-wrap">
                {work.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
