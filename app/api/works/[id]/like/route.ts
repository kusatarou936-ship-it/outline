import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // フロントから送られた JWT を取得
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  // Authorization を含めて Supabase クライアントを作成
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workId = params.id;

  // すでに押しているか確認
  const { data: existing } = await supabase
    .from("likes")
    .select("*")
    .eq("work_id", workId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
    return NextResponse.json({ liked: false });
  }

  await supabase.from("likes").insert({
    work_id: workId,
    user_id: user.id,
  });

  return NextResponse.json({ liked: true });
}
