"use client";

import { useState } from "react";

export default function InternalSubmit() {
  const [loading, setLoading] = useState(false);

  const handleInternalCreate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    window.location.href = "/submit/internal"; // ここは後で作品生成URLに変える
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-xl mx-auto space-y-10">
        <h1 className="text-2xl font-semibold">内部生成で投稿</h1>

        <p className="text-gray-300 leading-relaxed">
          Outline 内で作品ページを生成します。
        </p>

        <button
          onClick={handleInternalCreate}
          className="w-full bg-gray-800 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition"
        >
          生成を開始する
        </button>

        {loading && (
          <p className="text-center text-gray-400 text-sm pt-2">
            動画を視聴しています…
          </p>
        )}
      </div>
    </div>
  );
}
