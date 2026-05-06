import { notFound, redirect } from "next/navigation";
import { DeleteWorkButton } from "@/components/DeleteWorkButton";

export default async function DeleteWorkPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/works/${params.id}`, {
    cache: "no-store",
  });

  if (res.status === 404) notFound();
  if (res.status === 403) redirect("/");

  const work = await res.json();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">作品を削除しますか？</h1>
      <p className="text-gray-600">「{work.title}」を本当に削除しますか？</p>

      <DeleteWorkButton id={params.id} />
    </div>
  );
}
