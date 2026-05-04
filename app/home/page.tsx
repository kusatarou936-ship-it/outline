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
            <h1 className="text-3xl font-semibold tracking-wide">Outline</h1>
            <p className="opacity-80 text-lg">
              作品を静かに並べていく、小さなギャラリーです。
            </p>
          </div>

          {/* 説明文 */}
          <div className="space-y-4 text-left leading-relaxed text-gray-300">
            <p>
              Outline は、作品を「静かに置いていく」ことを大切にした
              ミニマルなギャラリーです。  
              SNS のように急かされることもなく、評価を気にする必要もありません。
            </p>

            <p>
              あなたが作ったものを、ただそっと置いていく。  
              誰かがふと訪れたときに、静かに眺めてもらえる。  
              そんな “余白のある場所” を目指しています。
            </p>

            {/* 投稿できる作品 */}
            <div className="pt-4 space-y-2">
              <h2 className="text-xl font-medium text-white">投稿できる作品</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Webアプリ・Webサービス</li>
                <li>ポートフォリオサイト</li>
                <li>デザイン・UI モック</li>
                <li>ツール・ジェネレーター</li>
                <li>ブラウザで動く作品全般</li>
              </ul>
              <p className="opacity-70 text-sm">
                ※ URL とサムネイル画像があれば投稿できます。
              </p>
            </div>

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
