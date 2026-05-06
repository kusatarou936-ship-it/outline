export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
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

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 自分の作品一覧
  const { data: works, error: worksError } = await supabase
    .from("works")
    .select("id")
    .eq("user_id", user.id);

  if (worksError) {
    console.error(worksError);
    return NextResponse.json({ error: "Failed to load works" }, { status: 500 });
  }

  const workIds = works.map((w) => w.id);

  // 総いいね数
  const { data: likes, error: likesError } = await supabase
    .from("likes")
    .select("id")
    .in("work_id", workIds);

  if (likesError) {
    console.error(likesError);
    return NextResponse.json({ error: "Failed to load likes" }, { status: 500 });
  }

  return NextResponse.json({
    totalWorks: works.length,
    totalLikes: likes.length,
  });
}
