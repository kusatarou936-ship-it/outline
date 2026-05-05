type Work = {
  id: string;
  visibility: "public" | "private";
  is_author: boolean;
  title: string;
  description: string;
  body_markdown: string | null;
  thumbnail_url: string | null;
};

export default async function Page({ params }: { params: { shortId: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/i/${params.shortId}`);
  const work: Work = await res.json();

  if (work.visibility === "private" && !work.is_author) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        この作品は非公開です。
      </div>
    );
  }

  return (
    <div>
      {/* 作品表示 */}
    </div>
  );
}
