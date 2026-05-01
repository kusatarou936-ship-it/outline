export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function UserPage({ params }: { params: { id: string } }) {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  const res = await fetch(`${API}/api/user/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-2xl">User Not Found</h1>
      </main>
    );
  }

  const { user, works, stacks, relatedUsers } = (await res.json()) as {
    user: any;
    works: any[];
    stacks: Record<string, number>;
    relatedUsers: any[];
  };

  const sortedStacks = Object.entries(stacks).sort((a, b) => b[1] - a[1]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-16">

        {/* Profile */}
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p className="opacity-80">{user.bio}</p>

          {user.links && (
            <div className="flex gap-4 text-sm opacity-80">
              {user.links.split(",").map((l: string) => (
                <a key={l} href={l} target="_blank" className="underline">
                  {l}
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Stack Trends */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">Tech Stack</h2>

          <div className="flex flex-wrap gap-2">
            {sortedStacks.map(([name, count]) => (
              <span
                key={name}
                className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
              >
                {name} × {count}
              </span>
            ))}
          </div>
        </section>

        {/* Works */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium">Works</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((w: any) => (
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

                  {w.auto && (
                    <div className="flex gap-2 text-xs opacity-80">
                      <span>Perf: {w.auto.performance}</span>
                      <span>A11y: {w.auto.a11y}</span>
                      <span>Mob: {w.auto.mobile}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Related Users */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium">Related Users</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedUsers.map((u: any) => (
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
      </div>
    </main>
  );
}
