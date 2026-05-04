"use client";

import { useState } from "react";

export default function HomePage() {
  const [unlocked, setUnlocked] = useState(false);

  const handleWatchAd = async () => {
    setUnlocked(true);
  };

  if (unlocked) {
    window.location.href = "/feed";
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex justify-center">
      <section className="max-w-2xl text-center space-y-8">

        <div className="space-y-2">
          <h1 className="text-2xl font-medium">Outline JA</h1>
          <p className="opacity-80">
            作品を静かに並べていく、小さなギャラリーです。
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">投稿できる作品について</h2>
          <p className="opacity-80 leading-relaxed">
            Outline では、URL で公開されている Web作品を投稿できます。<br />
            Webアプリ、ツール、デモページ、実験的なプロトタイプなど、<br />
            「ちょっと見てほしい Web の作品」をそっと置いておける場所です。
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">広告について</h2>
          <p className="opacity-80 leading-relaxed">
            Outline は無料で利用できますが、運営にはサーバー代がかかります。<br />
            広告収益はすべてサイトの維持に使われています。<br /><br />
            広告を見るかどうかは完全に自由です。<br />
            見ない場合は、作品の閲覧のみご利用いただけます。
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">利用を開始する</h2>
          <p className="opacity-80">
            広告を1本見ると、一定時間すべての機能が使えるようになります。
          </p>

          <button
            onClick={handleWatchAd}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            広告を見て利用する
          </button>
        </div>

        <p className="text-xs opacity-40 mt-12">© 2026 Outline</p>

      </section>
    </div>
  );
}
