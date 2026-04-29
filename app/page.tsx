import { getDBFromContext } from "@/lib/db";
import Card from "@/components/Card/Card";
import CardSkeleton from "@/components/Card/CardSkeleton";

export const dynamic = "force-dynamic";
export default async function HomePage() {
  const db = getDBFromContext();

  // works を新着順で取得
  const allWorks = await db.select().from(works).orderBy(works.createdAt);

  // auto_metrics をまとめて取得
  const metrics = await db.select().from(autoMetrics);

  // work_id → metrics のマップ
  const metricsMap = new Map(metrics.map((m) => [m.workId, m]));

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-8 text-gray-900">
        新着の作品
      </h1>

      {allWorks.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {allWorks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allWorks.map((w) => (
            <Card
              key={w.id}
              id={w.id}
              title={w.title}
              catchcopy={w.catch}
              thumbnail={w.thumbnail}
              stack={w.stack ?? []}
            />
          ))}
        </div>
      )}
    </main>
  );
}
