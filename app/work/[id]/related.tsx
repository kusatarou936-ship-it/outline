export default async function Related({ id }: { id: string }) {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  const res = await fetch(`${API}/api/related?work=${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const items = await res.json();

  if (items.length === 0) return null;

  return (
    <section className="mt-16 space-y-6">
      <h2 className="text-xl font-medium">Related Works</h2>

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
