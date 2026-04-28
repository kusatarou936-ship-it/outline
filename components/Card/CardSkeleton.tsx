export default function CardSkeleton() {
  return (
    <div className="rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] bg-white overflow-hidden animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-4 w-10 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
