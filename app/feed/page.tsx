"use client";

import type { Work } from "@/app/types";

export default async function FeedPage() {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${base}/api/works`, { cache: "no-store" });
  const works: Work[] = await res.json();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-semibold mb-10">新着の作品</h1>

        {works.length === 0 && (
          <p className="text-gray-400">まだ作品がありません。</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
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

              <h2 className="text-lg font-medium truncate">{work.title}</h2>
              <p className="text-gray-400 text-sm truncate">{work.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
