export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workId = params.id;

  // すでにお気に入り済みか確認
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("work_id", workId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    // お気に入り解除
    await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    return NextResponse.json({ favorited: false });
  }

  // お気に入り追加
  await supabase.from("favorites").insert({
    work_id: workId,
    user_id: user.id,
  });

  // 通知作成
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "favorite",
      work_id: workId,
      from_user_id: user.id,
    }),
  });

  return NextResponse.json({ favorited: true });
}
