export const dynamic = "force-dynamic";

export default async function WorkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // ここも DB / API は一切呼ばない
  const work = null;
  const auto = null;

  if (!work) {
    return (
      <main className="p-8">
        <p className="text-gray-600">作品が見つかりませんでした。</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-12">
      {/* ここは後でちゃんと戻す */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">{work.title}</h1>
      </header>
    </main>
  );
}
