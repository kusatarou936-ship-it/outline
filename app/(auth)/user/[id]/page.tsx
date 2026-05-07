"use client";

import { supabaseBrowser } from "../../../lib/supabase-browser";
import { useEffect, useState } from "react";

export default function UserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // ユーザー情報
      const { data: userData } = await supabaseBrowser
        .from("users")
        .select("id, name, bio, links, created_at")
        .eq("id", params.id)
        .single();

      if (!userData) {
        setLoading(false);
        return;
      }

      setUser(userData);

      // 作品一覧
      const { data: worksData } = await supabaseBrowser
        .from("works")
        .select(`
          id,
          title,
          description,
          thumbnail_url,
          created_at,
          user:users(id, name)
        `)
        .eq("user_id", params.id)
        .order("created_at", { ascending: false });

      setWorks(worksData ?? []);
      setLoading(false);
    }

    load();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p>読み込み中...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p>ユーザーが見つかりませんでした。</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 space-y-12">
      {/* Profile */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p className="opacity-60">
          Joined: {new Date(user.created_at).toLocaleDateString()}
        </p>

        {user.bio && (
          <p className="text-lg whitespace-pre-wrap opacity-80">{user.bio}</p>
        )}

        {user.links && (
          <div className="flex gap-4 mt-4">
            {Object.entries(user.links).map(([key, url]) => (
              <a
                key={key}
                href={url as string}
                target="_blank"
                className="underline opacity-80 hover:opacity-100"
              >
                {key}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Works */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">作品一覧</h2>

        {works.length === 0 && (
          <p className="opacity-60">まだ作品がありません。</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((w) => (
            <a
              key={w.id}
              href={`/work/${w.id}`}
              className="group block rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <div className="aspect-video bg-white/10 overflow-hidden">
                <img
                  src={
                    w.thumbnail_url ??
                    "https://placehold.co/1280x720/000/FFF?text=No+Thumbnail"
                  }
                  alt={w.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-lg font-medium">{w.title}</h3>
                <p className="text-sm opacity-60">{w.description ?? ""}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
