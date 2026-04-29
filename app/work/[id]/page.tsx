export const dynamic = "force-dynamic";

export default async function WorkDetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/works/${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <main className="p-8">
        <p className="text-gray-600">作品が見つかりませんでした。</p>
      </main>
    );
  }

  const { work, auto } = await res.json();

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">{work.title}</h1>
        {work.catch && <p className="text-lg text-gray-600">{work.catch}</p>}
      </header>

      {work.thumbnail && (
        <img
          src={work.thumbnail}
          alt=""
          className="w-full rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        />
      )}

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">文脈</h2>

        <div className="space-y-4 text-gray-700">
          {work.purpose && (
            <div>
              <h3 className="font-medium text-gray-900">目的</h3>
              <p>{work.purpose}</p>
            </div>
          )}

          {work.target && (
            <div>
              <h3 className="font-medium text-gray-900">対象</h3>
              <p>{work.target}</p>
            </div>
          )}

          {work.focus && (
            <div>
              <h3 className="font-medium text-gray-900">注力点</h3>
              <p>{work.focus}</p>
            </div>
          )}
        </div>
      </section>

      {work.stack?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">技術</h2>
          <div className="flex flex-wrap gap-2">
            {work.stack.map((s: string) => (
              <span
                key={s}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {auto && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">自動解析</h2>

          <div className="space-y-4 text-gray-700">
            <p>Performance: {auto.performance}</p>
            <p>A11y: {auto.a11y}</p>
            <p>Mobile: {auto.mobile}</p>
            <p>SSL: {auto.ssl ? "OK" : "NG"}</p>
            <p>i18n: {auto.i18n ? "OK" : "NG"}</p>

            {auto.detectedStack?.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900">検出された技術</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {auto.detectedStack.map((s: string) => (
                    <span
                      key={s}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">リンク</h2>

        <div className="space-y-2">
          <a href={work.url} target="_blank" className="text-blue-600 underline">
            作品を見る
          </a>

          {work.github && (
            <a
              href={work.github}
              target="_blank"
              className="text-blue-600 underline block"
            >
              GitHub
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
