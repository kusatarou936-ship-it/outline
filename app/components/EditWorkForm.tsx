"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditWorkForm({ id, initial }) {
  const router = useRouter();

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [body, setBody] = useState(initial.body_markdown);
  const [tags, setTags] = useState(initial.tags);
  const [visibility, setVisibility] = useState(initial.visibility);
  const [thumbnail, setThumbnail] = useState(initial.thumbnail_url);

  async function onSubmit(e) {
    e.preventDefault();

    const res = await fetch(`/api/works/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        body_markdown: body,
        tags,
        visibility,
        thumbnail_url: thumbnail,
      }),
    });

    if (res.ok) {
      router.push(`/work/${id}`);
      router.refresh();
    } else {
      alert("更新に失敗しました");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* タイトル */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />

      {/* 説明 */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea"
      />

      {/* 本文 */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="textarea h-64"
      />

      {/* タグ */}
      <input
        value={tags.join(",")}
        onChange={(e) => setTags(e.target.value.split(",").map((t) => t.trim()))}
        className="input"
      />

      {/* 公開設定 */}
      <select
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
        className="select"
      >
        <option value="public">公開</option>
        <option value="private">非公開</option>
      </select>

      {/* サムネイル */}
      <input
        value={thumbnail ?? ""}
        onChange={(e) => setThumbnail(e.target.value)}
        className="input"
      />

      <button className="btn-primary w-full">更新する</button>
    </form>
  );
}
