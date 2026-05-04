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
          <div className="space-y-12 text-left leading-relaxed text-gray-300">

            {/* コンセプト */}
            <section className="space-y-4">
              <h2 className="text-xl font-medium text-white">Outline とは</h2>
              <p>
                Outline は、作品を「静かに置いていく」ことを大切にした
                ミニマルなギャラリーです。
                SNS のように急かされることもなく、評価を気にする必要もありません。
              </p>
              <p>
                あなたが作ったものを、ただそっと置いていく。
                誰かがふと訪れたときに静かに眺めてもらえる、
                そんな “余白のある場所” を目指しています。
              </p>
            </section>

            {/* 投稿できる作品 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-white">投稿できる作品</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Webアプリ・Webサービス</li>
                <li>ポートフォリオサイト</li>
                <li>デザイン・UI モック</li>
                <li>ツール・ジェネレーター</li>
                <li>ブラウザで動く作品全般</li>
              </ul>
              <p className="opacity-70 text-sm">
                ※ URL とサムネイル画像があれば投稿できます。
              </p>
            </section>

            {/* AI 解析について */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-white">AI による解析について</h2>
              <p>
                投稿された作品は、AI によって以下の目的で軽く解析されます：
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>サムネイルの安全性チェック</li>
                <li>タイトル・説明文の補助生成</li>
                <li>タグの自動推定（編集可能）</li>
              </ul>

              <p className="opacity-80">
                ただし、AI は作品を評価したり、順位をつけたりはしません。
                Outline は “評価しない場所” です。
              </p>

              <p className="opacity-80">
                作品に対する感想は、ユーザー同士が自由に書くことができます。
                これは評価ではなく、あくまで「感想」として扱われます。
              </p>
            </section>

            {/* 利用について */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-white">利用について</h2>
              <p>
                投稿には広告視聴が必要ですが、
                それ以外の機能はすべて無料で利用できます。
              </p>
            </section>

          </div>

          {/* 以下そのまま */}

        </section>
      </div>
    </div>
  );
}
