"use client";

export default function ExternalSubmit() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-xl mx-auto space-y-10">
        <h1 className="text-2xl font-semibold">外部URLで投稿</h1>

        <p className="text-gray-300 leading-relaxed">
          外部の Web サイトの URL を使って作品を投稿します。
        </p>

        <input
          className="w-full p-3 bg-white/10 rounded"
          placeholder="https://example.com"
        />

        <button className="w-full bg-white text-black py-3 rounded-md font-medium hover:opacity-90 transition">
          投稿する
        </button>
      </div>
    </div>
  );
}
