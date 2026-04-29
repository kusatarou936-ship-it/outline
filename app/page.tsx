import Card from "@/components/Card/Card";
import CardSkeleton from "@/components/Card/CardSkeleton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // いったん DB / API は一切呼ばない
  const allWorks: any[] = [];

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
    </main>
  );
}
