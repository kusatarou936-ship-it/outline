export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
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

  const workId = params.id;

  // 総お気に入り数
  const { count, error } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("work_id", workId);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ログインユーザーの favorited 判定
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let favorited = false;

  if (user) {
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("work_id", workId)
      .eq("user_id", user.id)
      .maybeSingle();

    favorited = !!existing;
  }

  return NextResponse.json({
    count: count ?? 0,
    favorited,
  });
}
