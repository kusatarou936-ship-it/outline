export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
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

  // 認証
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { type, work_id, from_user_id } = body;

  if (!type || !work_id || !from_user_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 作品の作者を取得
  const { data: work, error: workError } = await supabase
    .from("works")
    .select("user_id")
    .eq("id", work_id)
    .single();

  if (workError || !work) {
    return NextResponse.json({ error: "Work not found" }, { status: 404 });
  }

  const to_user_id = work.user_id;

  // 自分自身への通知は作らない
  if (to_user_id === from_user_id) {
    return NextResponse.json({ ok: true });
  }

  // 通知を作成
  const { error: insertError } = await supabase.from("notifications").insert({
    type,
    work_id,
    from_user_id,
    user_id: to_user_id,
    read: false,
  });

  if (insertError) {
    console.error(insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
