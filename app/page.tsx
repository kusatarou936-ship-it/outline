export const dynamic = "force-dynamic";

export default async function HomePage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/works`, {
    cache: "no-store",
  });

  const works = res.ok ? await res.json() : [];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-8 text-gray-900">
        新着の作品
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((w: any) => (
          <a
            key={w.id}
            href={`/work/${w.id}`}
            className="block p-4 bg-white rounded-lg shadow"
          >
            <h2 className="font-semibold text-gray-900">{w.title}</h2>
            {w.catch && (
              <p className="text-gray-600 text-sm mt-1">{w.catch}</p>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}
