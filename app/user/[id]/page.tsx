import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function UserPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // ユーザー情報
  const { data: user } = await supabase
    .from("users")
    .select("id, name, bio, links, created_at")
    .eq("id", params.id)
    .single();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p>ユーザーが見つかりませんでした。</p>
      </main>
    );
  }

  // ユーザーの作品一覧
  const { data: works } = await supabase
    .from("works")
    .select(`
      id,
      title,
      description,
      thumbnail,
      created_at,
      user:users(id, name)
    `)
    .eq("user_id", params.id)
    .order("created_at", { ascending: false });

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

        {(!works || works.length === 0) && (
          <p className="opacity-60">まだ作品がありません。</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {works?.map((w) => (
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
                <p className="text-sm opacity-60">{w.description ?? ""}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
