import { supabase } from "@/lib/supabase";

export default async function Related({ id }: { id: string }) {
  // 現在の作品を取得（目的：purpose / focus / stack を使う）
  const { data: current } = await supabase
    .from("works")
    .select("id, purpose, focus, stack")
    .eq("id", id)
    .single();

  if (!current) return null;

  // 関連作品を取得（同じ purpose or focus or stack）
  const { data: related } = await supabase
    .from("works")
    .select(`
      id,
      title,
      thumbnail,
      created_at,
      user:users(id, name)
    `)
    .neq("id", id)
    .or(
      `
      purpose.eq.${current.purpose},
      focus.eq.${current.focus},
      stack.ilike.%${current.stack.split(",")[0]}%
      `
    )
    .order("created_at", { ascending: false })
    .limit(6);

  if (!related || related.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">Related Works</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {related.map((w) => (
          <a
            key={w.id}
            href={`/work/${w.id}`}
            className="group block rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div className="aspect-video bg-white/10 overflow-hidden">
              <img
                src={
                  w.thumbnail ??
                  "https://placehold.co/1280x720/000/FFF?text=No+Thumbnail"
                }
                alt={w.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-lg font-medium">{w.title}</h3>
              <p className="text-sm opacity-60">{w.user?.name}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
