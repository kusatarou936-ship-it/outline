import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workId = params.id;

  // すでに押しているか確認
  const { data: existing } = await supabase
    .from("likes")
    .select("*")
    .eq("work_id", workId)
    .eq("user_id", user.data.user.id)
    .maybeSingle();

  if (existing) {
    // いいね解除
    await supabase
      .from("likes")
      .delete()
      .eq("id", existing.id);

    return NextResponse.json({ liked: false });
  }

  // 新規いいね
  await supabase.from("likes").insert({
    work_id: workId,
    user_id: user.data.user.id,
  });

  return NextResponse.json({ liked: true });
}
