export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function FeedPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  const res = await fetch(`${API}/api/feed`, { cache: "no-store" });
  const feed = await res.json();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-16">

        <h1 className="text-3xl font-semibold">Feed</h1>

        {/* New Works */}
        <Section title="New Works" items={feed.newWorks} />

        {/* Updated Works */}
        <Section title="Recently Updated" items={feed.updatedWorks} />

        {/* Active Works */}
        <Section title="Active Works" items={feed.activeWorks} />

        {/* New Users */}
        <UsersSection title="New Users" items={feed.newUsers} />
      </div>
    </main>
  );
}

function Section({ title, items }: any) {
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((w: any) => (
          <a
            key={w.id}
            href={`/work/${w.id}`}
            className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div className="aspect-video bg-white/10 overflow-hidden">
              <img
                src={
                  w.thumbnail ??
                  "https://placehold.co/1280x720/000/FFF?text=No+Thumbnail"
                }
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-lg font-medium">{w.title}</h3>
              <p className="text-sm opacity-60">{w.catch}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function UsersSection({ title, items }: any) {
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">{title}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((u: any) => (
          <a
            key={u.id}
            href={`/user/${u.id}`}
            className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <p className="font-medium">{u.name}</p>
            <p className="text-xs opacity-60">Joined</p>
          </a>
        ))}
      </div>
    </section>
  );
}
