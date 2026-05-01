"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function NotificationsPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  const token = ""; // SSR では cookie を読めないので client で取得する

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <ClientNotifications />
    </main>
  );
}

import { useEffect, useState } from "react";

function ClientNotifications() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const token = document.cookie
        .split("; ")
        .find((r) => r.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const API =
        process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8787";

      const res = await fetch(`${API}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setItems(await res.json());
      }
    }

    load();
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-semibold">Notifications</h1>

      {items.length === 0 && (
        <p className="opacity-70">No notifications</p>
      )}

      <div className="space-y-4">
        {items.map((n, i) => (
          <NotificationItem key={i} n={n} />
        ))}
      </div>
    </div>
  );
}

function NotificationItem({ n }: any) {
  if (n.type === "thumbnail") {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="opacity-80">
          Thumbnail generated for{" "}
          <a href={`/work/${n.work.id}`} className="underline">
            {n.work.title}
          </a>
        </p>
      </div>
    );
  }

  if (n.type === "auto") {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="opacity-80">
          Auto analysis completed for{" "}
          <a href={`/work/${n.work.id}`} className="underline">
            {n.work.title}
          </a>
        </p>
      </div>
    );
  }

  if (n.type === "updated") {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="opacity-80">
          You updated{" "}
          <a href={`/work/${n.work.id}`} className="underline">
            {n.work.title}
          </a>
        </p>
      </div>
    );
  }

  if (n.type === "related") {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="opacity-80">
          New related work:{" "}
          <a href={`/work/${n.work.id}`} className="underline">
            {n.work.title}
          </a>
        </p>
      </div>
    );
  }

  if (n.type === "stack-user") {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="opacity-80">
          New user joined:{" "}
          <a href={`/user/${n.user.id}`} className="underline">
            {n.user.name}
          </a>
        </p>
      </div>
    );
  }

  return null;
}
