"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";

export default function Related({ id }: { id: string }) {
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: current } = await supabaseBrowser
        .from("works")
        .select("purpose, focus, stack")
        .eq("id", id)
        .single();

      if (!current) {
        setLoading(false);
        return;
      }

      const { data: rel } = await supabaseBrowser
        .from("works")
        .select("id, title, thumbnail_url")
        .neq("id", id)
        .or(
          [
            `purpose.eq.${current.purpose}`,
            `focus.eq.${current.focus}`,
            `stack.eq.${current.stack}`,
          ].join(",")
        )
        .limit(6);

      setRelated(rel ?? []);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading || related.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">関連作品</h2>

      <div className="grid grid-cols-2 gap-4">
        {related.map((w) => (
          <a
            key={w.id}
            href={`/work/${w.id}`}
            className="block rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <img
              src={
                w.thumbnail_url ??
                "https://placehold.co/600x400/000/FFF?text=No+Thumbnail"
              }
              alt={w.title}
              className="w-full h-24 object-cover"
            />
            <div className="p-2 text-sm">{w.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
