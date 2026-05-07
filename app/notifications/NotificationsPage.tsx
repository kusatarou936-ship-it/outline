"use client";

import { useEffect, useState } from "react";

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith(`${name}=`))
    ?.split("=")[1];
}

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const token = getCookie("token");

      // treat literal "undefined" as missing
      if (!token || token === "undefined") {
        window.location.href = "/login";
        return;
      }

      const API =
        process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8787";

      try {
        const res = await fetch(`${API}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          if (mounted) setItems(json);
        } else {
          // unauthorized or other error -> redirect to login
          if (res.status === 401) window.location.href = "/login";
        }
      } catch (e) {
        console.error("notifications fetch error", e);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-semibold">Notifications</h1>

        {items.length === 0 && <p className="opacity-70">No notifications</p>}

        <div className="space-y-4">
          {items.map((n, i) => (
            <NotificationItem key={i} n={n} />
          ))}
        </div>
      </div>
    </main>
  );
}

function NotificationItem({ n }: any) {
  if (!n) return null;

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
