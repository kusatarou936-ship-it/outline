type Work = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
};

export default async function FeedPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/works`);
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
