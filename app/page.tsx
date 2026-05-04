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

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">このサイトについて</h2>
        <p className="opacity-80 leading-relaxed">
          Outline JA は、作品を投稿・閲覧できるミニマルなギャラリーサイトです。
          サイトの運営費（サーバー代・データベース代）をまかなうため、
          一部の機能を利用する前に「広告を1本見る」必要があります。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">なぜ広告を見る必要があるの？</h2>
        <p className="opacity-80 leading-relaxed">
          このサイトは無料で提供していますが、維持にはコストがかかります。
          ユーザーに負担をかけないため、寄付や有料プランではなく、
          「広告を見ることで利用できる」方式を採用しています。
        </p>
        <p className="opacity-80 leading-relaxed">
          広告を見るかどうかは完全にあなたの自由です。
          見たくない場合は、作品の閲覧以外の機能は利用できません。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">利用を開始する</h2>
        <p className="opacity-80 leading-relaxed">
          広告を1本見ると、一定時間すべての機能が利用可能になります。
        </p>

        <button
          onClick={handleWatchAd}
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          広告を見て利用する
        </button>
      </section>

      <footer className="opacity-50 text-sm mt-20">
        © 2026 Outline
      </footer>
    </main>
  );
}
