export const dynamic = "force-dynamic";
// export const runtime = "edge";  ← 削除

import Related from "./related";
import DeleteButton from "./delete-button";
import { supabase } from "@/lib/supabase";

export default async function WorkPage({ params }: { params: { id: string } }) {
  const { data: work } = await supabase
    .from("works")
    .select(`
      id,
      title,
      catch,
      url,
      thumbnail,
      purpose,
      target,
      focus,
      stack,
      user_id,
      auto,
      created_at,
      updated_at,
      user:users(id, name),
      work_tags(tag:tags(name))
    `)
    .eq("id", params.id)
    .single();

  if (!work) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-2xl">Work Not Found</h1>
      </main>
    );
  }

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
              {work.user?.name ?? "View Author"}
            </a>

            <a href={`/work/${work.id}/edit`} className="underline">
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
            {/* 正規化されたタグ */}
            {work.work_tags?.map((t: any) => (
              <a
                key={t.tag.name}
                href={`/tag/${encodeURIComponent(t.tag.name)}`}
                className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
              >
                {t.tag.name}
              </a>
            ))}
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
