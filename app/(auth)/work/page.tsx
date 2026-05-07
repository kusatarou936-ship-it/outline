// app/work/[id]/page.tsx
import WorkPage from "../../work/[id]/WorkPage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function Page({ params }: { params: { id: string } }) {
  return <WorkPage params={params} />;
}
