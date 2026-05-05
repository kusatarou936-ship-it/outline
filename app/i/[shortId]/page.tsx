import { createClient } from "@/lib/supabase";
import WorkPage from "@/app/work/[id]/page";

export default async function InternalWorkPage({ params }: { params: { shortId: string } }) {
    const supabase = createClient();

    const { data: work } = await supabase
        .from("works")
        .select("id")
        .eq("short_id", params.shortId)
        .single();

    if (!work) {
        return (
            <div className="min-h-screen bg-black text-white p-10">
                作品が見つかりません
            </div>
        );
    }

    if (work.visibility === "private" && !work.is_author) {
        return (
            <div className="min-h-screen bg-black text-white p-10">
                この作品は非公開です。
            </div>
        );
    }

    // 既存の WorkPage をそのまま再利用
    return <WorkPage params={{ id: work.id }} />;
}
