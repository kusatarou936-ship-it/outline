"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);

  const handleInternalCreate = async () => {
    setLoading(true);

    // 動画広告視聴 → URL 発行（仮処理）
    await new Promise((r) => setTimeout(r, 2000));

    // 作品ページ生成後の URL に遷移
    window.location.href = "/submit/internal";
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-xl mx-auto space-y-10">

        <h1 className="text-2xl font-semibold">作品を投稿する</h1>

        <p className="text-gray-300 leading-relaxed">
          Outline では、Web作品を 2 つの方法で投稿できます。
        </p>

        <div className="space-y-6">

          {/* 外部URL */}
          <button
            onClick={() => (window.location.href = "/submit/external")}
            className="w-full bg-white text-black py-3 rounded-md font-medium hover:opacity-90 transition"
          >
            外部URLを使って投稿する
          </button>

          {/* 内部生成 */}
          <button
            onClick={handleInternalCreate}
            className="w-full bg-gray-800 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition"
          >
            Outline 内で作品ページを作る（URL不要）
          </button>

          {loading && (
            <p className="text-center text-gray-400 text-sm pt-2">
              動画を視聴しています…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
