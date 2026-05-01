import { useState } from "react";
import { uploadThumbnail } from "@/lib/uploadThumbnail";

export default function NewPostPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const file = e.target.thumbnail.files[0];
    let thumbnailId = null;

    // 画像が選ばれていたら Worker にアップロード
    if (file) {
      thumbnailId = await uploadThumbnail(file);
    }

    // あなたの DB 保存処理
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: e.target.title.value,
        body: e.target.body.value,
        thumbnailId,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("投稿完了");
      window.location.href = "/";
    } else {
      alert("投稿に失敗しました");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input name="title" placeholder="タイトル" required />

      <textarea
        name="body"
        placeholder="本文"
        rows={6}
        required
      />

      <input type="file" name="thumbnail" accept="image/*" />

      <button type="submit" disabled={loading}>
        {loading ? "送信中…" : "投稿する"}
      </button>
    </form>
  );
}
