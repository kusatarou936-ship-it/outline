export const dynamic = "force-dynamic";
export const runtime = "edge";

import Related from "./related";
import DeleteButton from "./delete-button";

export default async function WorkPage({ params }: { params: { id: string } }) {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  const res = await fetch(`${API}/api/work/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-2xl">Work Not Found</h1>
      </main>
    );
  }

  const work = await res.json();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-12">

        {/* Title */}
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold">{work.title}</h1>
          <p className="opacity-80">{work.catch}</p>

          <a
            href={work.url}
            target="_blank"
            className="underline opacity-80 hover:opacity-100"
          >
            Visit Website →
          </a>

          <div className="flex gap-4 text-sm opacity-70">
            <a href={`/user/${work.user_id}`} className="underline">
              View Author
            </a>

            <a
              href={`/work/${work.id}/edit`}
              className="underline"
            >
              Edit
            </a>

            <DeleteButton id={work.id} />
          </div>
        </section>

        {/* Thumbnail */}
        <section>
          <img
            src={
              work.thumbnail ??
              "https://placehold.co/1280x720/000/FFF?text=No+Thumbnail"
            }
            alt=""
            className="rounded-xl border border-white/10"
          />
        </section>

        {/* Details */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-medium mb-2">Purpose</h2>
            <p className="opacity-80">{work.purpose}</p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">Target</h2>
            <p className="opacity-80">{work.target}</p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-2">Focus</h2>
            <p className="opacity-80">{work.focus}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {work.stack.split(",").map((s: string) => (
              <a
                key={s}
                href={`/tag/${encodeURIComponent(s)}?type=stack`}
                className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
              >
                {s}
              </a>
            ))}

            <a
              href={`/tag/${encodeURIComponent(work.purpose)}?type=purpose`}
              className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
            >
              {work.purpose}
            </a>

            <a
              href={`/tag/${encodeURIComponent(work.focus)}?type=focus`}
              className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
            >
              {work.focus}
            </a>
          </div>
        </section>

        {/* Auto Metrics */}
        {work.auto && (
          <section className="space-y-4">
            <h2 className="text-xl font-medium">Auto Analysis</h2>

            <div className="flex gap-4 text-sm opacity-80">
              <span>Performance: {work.auto.performance}</span>
              <span>A11y: {work.auto.a11y}</span>
              <span>Mobile: {work.auto.mobile}</span>
            </div>
          </section>
        )}

        {/* Related Works */}
        <Related id={work.id} />
      </div>
    </main>
  );
}
