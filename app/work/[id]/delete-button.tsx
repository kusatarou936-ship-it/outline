"use client";

export default function DeleteButton({ id }: { id: string }) {
  async function del() {
    if (!confirm("Delete this work?")) return;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const API =
      process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8787";

    const res = await fetch(`${API}/api/work/delete`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      window.location.href = "/works";
    } else {
      alert("Error");
    }
  }

  return (
    <button
      onClick={del}
      className="px-4 py-2 rounded bg-red-600 text-white text-sm"
    >
      Delete
    </button>
  );
}
