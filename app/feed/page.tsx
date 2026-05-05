type Work = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
};

export default async function FeedPage() {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${base}/api/works`, { cache: "no-store" });
  const works: Work[] = await res.json();

  return (
    <div>
      {works.map((work) => (
        <a
          key={work.id}
          href={`/work/${work.id}`}
          className="group space-y-3 block"
        >
          {/* ... */}
        </a>
      ))}
    </div>
  );
}
