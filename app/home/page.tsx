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

          <div className="space-y-14 text-left leading-relaxed text-gray-300">

            {/* コンセプト */}
            <section className="space-y-4">
              <h2 className="text-xl font-medium text-white">Outline とは</h2>
              <p>
                Outline は、作品を「静かに置いていく」ことを大切にした
                ミニマルな Web ギャラリーです。
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

              <p>
                Outline では、すべての作品を「Web作品」として展示します。
                投稿方法は次の 2 種類です。
              </p>

              <ul className="list-disc list-inside space-y-1">
                <li>
                  <span className="font-medium text-white">外部URLを持つ Web作品</span><br />
                  あなたが作った Webアプリやサービスを、そのまま紹介できます。
                </li>

                <li>
                  <span className="font-medium text-white">Outline 内で生成される Web作品（URL 不要）</span><br />
                  URL を持っていない場合は、
                  <span className="text-white font-medium">動画広告を視聴することで作品ページの URL を発行</span>できます。
                  タイトル・説明文・本文を入力するだけで、
                  ひとつの Web作品として投稿できます。
                </li>
              </ul>

              <p className="opacity-70 text-sm">
                ※ 画像だけの展示や、動画・文章単体の投稿はできません。  
                ※ すべて Webページとして統一されます。
              </p>
            </section>

            {/* AI 解析について */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-white">AI による解析について</h2>

              <p>投稿された作品は、以下の目的で AI による解析が行われます：</p>

              <ul className="list-disc list-inside space-y-1">
                <li>サムネイル画像の安全性チェック</li>
                <li>URL の安全性チェック</li>
                <li>作品内容からのタグ自動推定（編集可能）</li>
                <li>タイトル・説明文の補助生成</li>
                <li>作品ジャンルの分類</li>
              </ul>

              <p className="opacity-80">
                ただし、AI は作品を評価したり、順位をつけたりはしません。
                Outline は “評価しない場所” です。
              </p>
            </section>

            {/* AI アドバイス（作者専用） */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-white">AI アドバイス（作者専用）</h2>

              <p>
                投稿者は、作品の管理画面から動画広告を視聴することで
                AI から作品に関するアドバイスを受け取ることができます。
              </p>

              <ul className="list-disc list-inside space-y-1">
                <li>説明文の改善ポイント</li>
                <li>タグの最適化</li>
                <li>サムネイル改善案</li>
                <li>作品の強みの言語化</li>
                <li>初見ユーザーが迷いそうな点の指摘</li>
              </ul>

              <p className="opacity-80">
                必要なときだけ使える “作者専用のサポート機能” です。
                使わなくても作品の公開には影響しません。
              </p>
            </section>

            {/* 作者用・閲覧者用の入り口 */}
            <section className="space-y-6 pt-4">
              <h2 className="text-xl font-medium text-white">はじめる</h2>

              <div className="space-y-4">
                <a
                  href="/submit"
                  className="block w-full text-center bg-white text-black py-3 rounded-md font-medium hover:opacity-90 transition"
                >
                  作品を投稿する（作者用）
                </a>

                <a
                  href="/feed"
                  className="block w-full text-center bg-gray-800 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition"
                >
                  作品を見る（閲覧者用）
                </a>
              </div>
            </section>

          </div>

        </section>
      </div>
    </div>
  );
}
