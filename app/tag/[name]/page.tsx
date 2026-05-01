export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { type: string };
}) {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  const type = searchParams.type || "stack";
  const tag = decodeURIComponent(params.name);

  const res = await fetch(
    `${API}/api/tag?tag=${encodeURIComponent(tag)}&type=${type}`,
    { cache: "no-store" }
  );

  const items = res.ok ? await res.json() : [];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-12">

        <h1 className="text-3xl font-semibold">
          Tag: {tag}
          <span className="text-sm opacity-60 ml-2">({type})</span>
        </h1>

        {items.length === 0 && (
          <p className="opacity-70">No works found.</p>
        )}

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
      </div>
    </main>
  );
}
