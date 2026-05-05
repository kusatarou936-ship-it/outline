"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Work } from "@/app/types";

export default function WorkPage({ params }: { params: { id: string } }) {
  const [work, setWork] = useState<Work | null>(null);
  const [advice, setAdvice] = useState<Work["advice"]>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    fetchWork();
    fetchAdvice();
  }, []);

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const loadComments = async () => {
    const res = await fetch(`/api/works/${params.id}/comments`);
    const data = await res.json();
    setComments(data);
  };

  const submitComment = async () => {
    if (!comment.trim()) return;

    await fetch(`/api/works/${params.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });

    setComment("");
    loadComments();
  };

  useEffect(() => {
    fetchWork();
    fetchAdvice();
    loadComments(); // ← コメント読み込み
  }, []);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const loadLikes = async () => {
    const res = await fetch(`/api/works/${params.id}/likes`);
    const data = await res.json();
    setLikeCount(data.count);
  };

  const toggleLike = async () => {
    const res = await fetch(`/api/works/${params.id}/like`, {
      method: "POST",
    });
    const data = await res.json();

    setLiked(data.liked);
    loadLikes();
  };

  useEffect(() => {
    fetchWork();
    fetchAdvice();
    loadComments();
    loadLikes(); // ← 追加
  }, []);

  const [favorited, setFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const loadFavorites = async () => {
    const res = await fetch(`/api/works/${params.id}/favorites`);
    const data = await res.json();
    setFavoriteCount(data.count);
  };

  const toggleFavorite = async () => {
    const res = await fetch(`/api/works/${params.id}/favorite`, {
      method: "POST",
    });
    const data = await res.json();

    setFavorited(data.favorited);
    loadFavorites();
  };

  useEffect(() => {
    fetchWork();
    fetchAdvice();
    loadComments();
    loadLikes();
    loadFavorites(); // ← 追加
  }, []);

  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const submitReply = async (parentId: string) => {
    if (!reply.trim()) return;

    await fetch(`/api/works/${params.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: reply,
        reply_to: parentId,
      }),
    });

    setReply("");
    setReplyTarget(null);
    loadComments();
  };

  const fetchWork = async () => {
    const res = await fetch(`/api/works/${params.id}`);
    const data: Work = await res.json();
    setWork(data);
  };

  const fetchAdvice = async () => {
    const res = await fetch(`/api/works/${params.id}/advice`);
    const data = await res.json();
    setAdvice(data.advice ?? null);
  };

  const handleGenerateAdvice = async () => {
    setLoadingAdvice(true);

    // 本来は広告視聴 → 完了後に POST
    await new Promise((r) => setTimeout(r, 2000));

    const res = await fetch(`/api/works/${params.id}/advice`, {
      method: "POST",
    });

    const data = await res.json();
    setAdvice(data.advice);
    setLoadingAdvice(false);
  };

  if (!work) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-16">
        <p>読み込み中…</p>
      </div>
    );
  }

  if (work.visibility === "private" && !work.is_author) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        この作品は非公開です。
      </div>
    );
  }

  const isInternal = work.type === "internal";

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* タイトル */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">{work.title}</h1>
          <p className="text-gray-400 text-sm">
            作者：{work.author_name ?? "匿名"} / 公開日：
            {new Date(work.created_at).toLocaleDateString("ja-JP")}
          </p>
        </header>

        {/* いいねボタン */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={toggleLike}
            className={`px-4 py-2 rounded ${liked ? "bg-white text-black" : "bg-gray-800 text-white"
              }`}
          >
            {liked ? "♥ いいね済み" : "♡ いいね"}
          </button>

          {/* お気に入り */}
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded ${favorited ? "bg-yellow-400 text-black" : "bg-gray-800 text-white"
              }`}
          >
            {favorited ? "★ お気に入り済み" : "☆ お気に入り"}
          </button>

          <span className="text-gray-400">{favoriteCount} 件</span>

          <span className="text-gray-400">{likeCount} 件</span>
        </div>

        {/* サムネイル */}
        {work.thumbnail_url && (
          <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={work.thumbnail_url}
              className="w-full h-full object-cover"
              alt="thumbnail"
            />
          </div>
        )}

        {/* 説明文 */}
        <section className="space-y-2">
          <h2 className="text-xl font-medium">説明</h2>
          <p className="text-gray-300 leading-relaxed">
            {work.description ?? ""}
          </p>
        </section>

        {/* 本文（internal） */}
        {isInternal && work.body_markdown && (
          <section className="space-y-2">
            <h2 className="text-xl font-medium">作品内容</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{work.body_markdown}</ReactMarkdown>
            </div>
          </section>
        )}

        {/* 外部URL作品 */}
        {work.type === "external" && work.url && (
          <a
            href={work.url}
            target="_blank"
            className="block text-center bg-white text-black py-3 rounded-md font-medium hover:opacity-90 transition"
          >
            作品を開く
          </a>
        )}

        {/* タグ */}
        <section className="flex gap-2 flex-wrap">
          {work.tags?.map((tag) => (
            <a
              key={tag}
              href={`/tag/${tag}`}
              className="px-3 py-1 bg-gray-800 rounded-full text-sm"
            >
              #{tag}
            </a>
          ))}
        </section>

        {/* AI アドバイス（作者専用） */}
        {work.is_author && (
          <section className="space-y-4 pt-10 border-t border-gray-800">
            <h2 className="text-xl font-medium">AI アドバイス</h2>

            {!advice && (
              <button
                onClick={handleGenerateAdvice}
                className="w-full bg-gray-800 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition"
              >
                {loadingAdvice ? "生成中…" : "広告を視聴してアドバイスを受け取る"}
              </button>
            )}

            {advice && (
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="font-medium text-white">説明文の改善ポイント</h3>
                  <p>{advice.description ?? ""}</p>
                </div>

                <div>
                  <h3 className="font-medium text-white">タグの最適化</h3>
                  <p>{advice.tags ?? ""}</p>
                </div>

                <div>
                  <h3 className="font-medium text-white">サムネイル改善案</h3>
                  <p>{advice.thumbnail ?? ""}</p>
                </div>

                <div>
                  <h3 className="font-medium text-white">作品の強み</h3>
                  <p>{advice.strengths ?? ""}</p>
                </div>

                <div>
                  <h3 className="font-medium text-white">初見ユーザーが迷いそうな点</h3>
                  <p>{advice.confusion ?? ""}</p>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
      {/* コメント欄 */}
      <section className="pt-10 border-t border-gray-800 space-y-6">
        <h2 className="text-xl font-medium">コメント</h2>

        {/* コメント投稿 */}
        <div className="space-y-3">
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 h-24"
            placeholder="コメントを書く…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={submitComment}
            className="bg-white text-black px-4 py-2 rounded font-medium hover:opacity-90 transition"
          >
            投稿する
          </button>
        </div>

        {/* コメント一覧 */}
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="border border-gray-800 p-4 rounded">
              <p className="text-gray-300 whitespace-pre-wrap">{c.content}</p>
              <p className="text-gray-500 text-xs mt-2">
                {new Date(c.created_at).toLocaleString("ja-JP")}
              </p>
            </div>
          ))}
        </div>
      </section>
      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="border border-gray-800 p-4 rounded">

            {/* 親コメント */}
            <p className="text-gray-300 whitespace-pre-wrap">{c.content}</p>
            <p className="text-gray-500 text-xs mt-1">
              {new Date(c.created_at).toLocaleString("ja-JP")}
            </p>

            {/* 返信ボタン */}
            <button
              onClick={() => setReplyTarget(c.id)}
              className="text-sm text-blue-400 mt-2 hover:underline"
            >
              返信する
            </button>

            {/* 返信フォーム（対象のときだけ表示） */}
            {replyTarget === c.id && (
              <div className="mt-3 space-y-2">
                <textarea
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 h-20"
                  placeholder="返信を書く…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />

                <button
                  onClick={() => submitReply(c.id)}
                  className="bg-white text-black px-3 py-1 rounded hover:opacity-90"
                >
                  返信を投稿
                </button>
              </div>
            )}

            {/* 返信一覧 */}
            <div className="mt-4 pl-4 border-l border-gray-800 space-y-4">
              {c.replies.map((r) => (
                <div key={r.id}>
                  <p className="text-gray-300 whitespace-pre-wrap">{r.content}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(r.created_at).toLocaleString("ja-JP")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
