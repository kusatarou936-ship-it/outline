import { notFound, redirect } from "next/navigation";

export default async function EditWorkPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/works/${params.id}`, {
    cache: "no-store",
  });

  if (res.status === 404) notFound();
  if (res.status === 403) redirect("/");

  const work = await res.json();

  return (
    <EditWorkForm
      id={params.id}
      initial={{
        title: work.title,
        description: work.description,
        body_markdown: work.body_markdown,
        tags: work.tags,
        visibility: work.visibility,
        thumbnail_url: work.thumbnail_url,
      }}
    />
  );
}
