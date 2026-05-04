"use client";

import { useState } from "react";

export default function HomePage() {
  const [unlocked, setUnlocked] = useState(false);

  const handleWatchAd = async () => {
    // ★ ここにリワード広告 SDK を入れる（AdMob / AppLovin / Unity Ads など）
    // 例: await showRewardedAd();
    // 成功したら:
    setUnlocked(true);
  };

  if (unlocked) {
    // 広告を見たら feed に遷移
    window.location.href = "/feed";
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 space-y-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Outline JA</h1>

      <section className="space-y-6">
        <h1 className="text-2xl font-medium">Outline JA</h1>
        <p className="opacity-80">
          作品を静かに並べていく、小さなギャラリーです。
        </p>

        <hr className="opacity-20" />

        <h2 className="text-lg font-medium">投稿できる作品について</h2>
        <p className="opacity-80">
          Outline では、URL で公開されている Web作品を投稿できます。<br />
          Webアプリ、ツール、デモページ、実験的なプロトタイプなど、<br />
          「ちょっと見てほしい Web の作品」をそっと置いておける場所です。
        </p>

        <hr className="opacity-20" />

        <h2 className="text-lg font-medium">広告について</h2>
        <p className="opacity-80">
          Outline は無料で利用できますが、運営にはサーバー代がかかります。<br />
          広告収益はすべてサイトの維持に使われています。<br /><br />
          広告を見るかどうかは完全に自由です。<br />
          見ない場合は、作品の閲覧のみご利用いただけます。
        </p>

        <hr className="opacity-20" />

        <h2 className="text-lg font-medium">利用を開始する</h2>
        <p className="opacity-80">
          広告を1本見ると、一定時間すべての機能が使えるようになります。
        </p>

        <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
          広告を見て利用する
        </button>

        <p className="text-xs opacity-40 mt-8">© 2026 Outline</p>
      </section>


      <footer className="opacity-50 text-sm mt-20">
        © 2026 Outline
      </footer>
    </main>
  );
}
