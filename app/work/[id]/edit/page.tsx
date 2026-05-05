"use client";

import { useEffect, useState } from "react";
import type { Work } from "@/app/types";

export default function EditWorkPage({ params }: { params: { id: string } }) {
    const [work, setWork] = useState<Work | null>(null);
    const [saving, setSaving] = useState(false);

    // ★ これが必要
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await fetch(`/api/works/${params.id}`);
        const data: Work = await res.json();
        setWork(data);
    };

    const save = async () => {
        if (!work) return;

        setSaving(true);

        await fetch(`/api/works/${params.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(work),
        });

        setSaving(false);
        alert("保存しました");
    };

    if (!work) {
        return (
            <div className="min-h-screen bg-black text-white p-10">
                読み込み中…
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white px-6 py-16">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* 編集フォーム */}
                <div className="space-y-8">

                    {/* タイトル */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">タイトル</label>
                        <input
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                            value={work.title}
                            onChange={(e) => setWork({ ...work, title: e.target.value })}
                        />
                    </div>

                    {/* 説明文 */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">説明文</label>
                        <textarea
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 h-32"
                            value={work.description ?? ""}
                            onChange={(e) => setWork({ ...work, description: e.target.value })}
                        />
                    </div>

                    {/* タグ */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">タグ（カンマ区切り）</label>
                        <input
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                            value={work.tags?.join(",") ?? ""}
                            onChange={(e) =>
                                setWork({ ...work, tags: e.target.value.split(",").map((t) => t.trim()) })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">公開設定</label>
                        <select
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                            value={work.visibility}
                            onChange={(e) =>
                                setWork({
                                    ...work,
                                    visibility: e.target.value as "public" | "private" | "unlisted",
                                })
                            }
                        >
                            <option value="public">公開</option>
                            <option value="unlisted">限定公開</option>
                            <option value="private">非公開（下書き）</option>
                        </select>

                    </div>

                    {/* 本文（内部生成作品のみ） */}
                    {work.type === "internal" && (
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">本文（Markdown）</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 h-64"
                                value={work.body_markdown ?? ""}
                                onChange={(e) =>
                                    setWork({ ...work, body_markdown: e.target.value })
                                }
                            />
                        </div>
                    )}

                    <button
                        onClick={async () => {
                            const res = await fetch(`/api/works/${params.id}/thumbnail`, {
                                method: "POST",
                            });
                            const data = await res.json();
                            setWork({ ...work, thumbnail_url: data.thumbnail_url });
                        }}
                        className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition"
                    >
                        サムネイルを再生成する
                    </button>
                    {/* 保存ボタン */}
                    <button
                        onClick={save}
                        className="w-full bg-white text-black py-3 rounded font-medium hover:opacity-90 transition"
                    >
                        {saving ? "保存中…" : "保存する"}
                    </button>
                    <button
                        onClick={async () => {
                            if (!confirm("本当に削除しますか？")) return;

                            await fetch(`/api/works/${params.id}`, {
                                method: "DELETE",
                            });

                            alert("削除しました");
                            window.location.href = "/me";
                        }}
                        className="w-full bg-red-600 text-white py-3 rounded font-medium hover:bg-red-500 transition"
                    >
                        作品を削除する
                    </button>
                </div>

                {/* AI アドバイス（右側） */}
                <div className="space-y-6 border-l border-gray-800 pl-6">
                    <h2 className="text-xl font-semibold">AI アドバイス</h2>

                    {!work.advice && (
                        <p className="text-gray-500">まだアドバイスが生成されていません。</p>
                    )}

                    {work.advice && (
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <div>
                                <h3 className="font-medium text-white">説明文の改善ポイント</h3>
                                <p>{work.advice.description}</p>
                            </div>

                            <div>
                                <h3 className="font-medium text-white">タグの最適化</h3>
                                <p>{work.advice.tags}</p>
                            </div>

                            <div>
                                <h3 className="font-medium text-white">サムネイル改善案</h3>
                                <p>{work.advice.thumbnail}</p>
                            </div>

                            <div>
                                <h3 className="font-medium text-white">作品の強み</h3>
                                <p>{work.advice.strengths}</p>
                            </div>

                            <div>
                                <h3 className="font-medium text-white">初見ユーザーが迷いそうな点</h3>
                                <p>{work.advice.confusion}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="pt-10 border-t border-gray-800">
                    <h2 className="text-xl font-semibold mb-4">バージョン履歴</h2>

                    <button
                        onClick={async () => {
                            const res = await fetch(`/api/works/${params.id}/history`);
                            const data = await res.json();
                            setHistory(data);
                        }}
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        履歴を読み込む
                    </button>

                    <div className="mt-4 space-y-4">
                        {history.map((h) => (
                            <div key={h.id} className="border border-gray-700 p-4 rounded">
                                <p className="text-gray-400 text-sm">
                                    {new Date(h.created_at).toLocaleString("ja-JP")}
                                </p>

                                <button
                                    onClick={async () => {
                                        await fetch(`/api/works/${params.id}/restore`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ history_id: h.id }),
                                        });
                                        alert("復元しました");
                                        load(); // 最新状態を再取得
                                    }}
                                    className="mt-2 bg-white text-black px-3 py-1 rounded hover:opacity-90"
                                >
                                    このバージョンに戻す
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
