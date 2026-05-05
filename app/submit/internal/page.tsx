export default function InternalSubmit() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-xl mx-auto space-y-8">

        <h1 className="text-2xl font-semibold">Outline 内で作品ページを作成</h1>

        <p className="text-gray-400 text-sm">
          動画視聴が完了しました。作品ページの内容を入力してください。
        </p>

        <form className="space-y-6">

          <div>
            <label className="block mb-1">タイトル</label>
            <input className="w-full bg-gray-900 p-3 rounded" />
          </div>

          <div>
            <label className="block mb-1">説明文</label>
            <textarea className="w-full bg-gray-900 p-3 rounded h-24" />
          </div>

          <div>
            <label className="block mb-1">本文（Markdown）</label>
            <textarea className="w-full bg-gray-900 p-3 rounded h-40" />
          </div>

          <div>
            <label className="block mb-1">サムネイル画像</label>
            <input type="file" className="w-full bg-gray-900 p-3 rounded" />
          </div>

          <button className="w-full bg-white text-black py-3 rounded-md font-medium hover:opacity-90 transition">
            投稿する
          </button>

        </form>
      </div>
    </div>
  );
}
