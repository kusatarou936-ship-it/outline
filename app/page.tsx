export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function HomePage() {
  const API = process.env.NEXT_PUBLIC_API_URL!;

  const res = await fetch(`${API}/api/home`, { cache: "no-store" });

  const data = (await res.json()) as {
    stacks: Record<string, number>;
    purposes: Record<string, number>;
    focuses: Record<string, number>;
    newWorks: any[];
    updatedWorks: any[];
    newUsers: any[];
  };

  const sortedStacks = Object.entries(data.stacks).sort((a, b) => b[1] - a[1]);
  const sortedPurposes = Object.entries(data.purposes).sort((a, b) => b[1] - a[1]);
  const sortedFocuses = Object.entries(data.focuses).sort((a, b) => b[1] - a[1]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-16">

        {/* Hero */}
        <section className="space-y-6">
          <h1 className="text-4xl font-semibold">Outline</h1>
          <p className="opacity-80 max-w-xl">
            A quiet showcase for personal creations.
            No rankings. No noise. Just your work.
          </p>

          <div className="flex gap-4">
            <a
              href="/submit"
              className="px-6 py-3 rounded bg-white text-black font-medium"
            >
              Submit Work
            </a>

            <a
              href="/dashboard"
              className="px-6 py-3 rounded bg-white/10 border border-white/20"
            >
              Dashboard
            </a>
          </div>
        </section>

        {/* New Works */}
        <Section title="New Works" items={data.newWorks} />

        {/* Updated Works */}
        <Section title="Recently Updated" items={data.updatedWorks} />

        {/* Popular Tags */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium">Popular Tags</h2>

          <div className="flex flex-wrap gap-2">
            {sortedStacks.slice(0, 10).map(([name, count]) => (
              <a
                key={name}
                href={`/tag/${encodeURIComponent(name)}?type=stack`}
                className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
              >
                {name} × {count}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {sortedPurposes.slice(0, 10).map(([name, count]) => (
              <a
                key={name}
                href={`/tag/${encodeURIComponent(name)}?type=purpose`}
                className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
              >
                {name} × {count}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {sortedFocuses.slice(0, 10).map(([name, count]) => (
              <a
                key={name}
                href={`/tag/${encodeURIComponent(name)}?type=focus`}
                className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
              >
                {name} × {count}
              </a>
            ))}
          </div>
        </section>

        {/* New Users */}
        <UsersSection title="New Users" items={data.newUsers} />
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
