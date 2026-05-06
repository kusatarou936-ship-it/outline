"use client";

import { useRouter } from "next/navigation";

export function DeleteWorkButton({ id }: { id: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm("本当に削除しますか？")) return;

    const res = await fetch(`/api/works/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      alert("削除に失敗しました");
    }
  }

  return (
    <button onClick={onDelete} className="btn-danger w-full">
      削除する
    </button>
  );
}
