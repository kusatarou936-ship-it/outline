export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-white/10 rounded" />
        <div className="h-6 w-1/2 bg-white/10 rounded" />
        <div className="h-64 bg-white/10 rounded" />
      </div>
    </main>
  );
}
