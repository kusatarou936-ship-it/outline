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
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <section className="text-center space-y-10">

          {/* タイトル */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-wide">Outline JA</h1>
            <p className="opacity-80 text-lg">
              作品を静かに並べていく、小さなギャラリーです。
            </p>
          </div>

          {/* 説明文 */}
          <div className="space-y-4 text-left leading-relaxed text-gray-300">
            <p>
              Outline JA は、作品を「静かに置いていく」ことを大切にした
              ミニマルなギャラリーです。  
              SNS のように急かされることもなく、評価を気にする必要もありません。
            </p>

            <p>
              あなたが作ったものを、ただそっと置いていく。  
              誰かがふと訪れたときに、静かに眺めてもらえる。  
              そんな “余白のある場所” を目指しています。
            </p>

            <p>
              投稿には広告視聴が必要ですが、  
              それ以外の機能はすべて無料で利用できます。
            </p>
          </div>

          {/* 以下そのまま */}

        </section>
      </div>
    </div>
  );
}
