export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
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

  // ログインユーザー（いなくてもOK）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. 新着作品（最新 12 件）
  const { data: latest } = await supabase
    .from("works")
    .select("id, title, description, thumbnail_url, tags, created_at")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(12);

  // 2. 人気作品（いいね数順）
  const { data: popular } = await supabase
    .from("works")
    .select("id, title, description, thumbnail_url, tags, created_at, likes(count)")
    .eq("visibility", "public")
    .order("likes.count", { ascending: false })
    .limit(12);

  // 3. ユーザー向けおすすめ（タグベース）
  let recommended: any[] = [];

  if (user) {
    // ユーザーがいいねした作品のタグを取得
    const { data: likedWorks } = await supabase
      .from("likes")
      .select("work:works(tags)")
      .eq("user_id", user.id)
      .limit(20);

    const tagCounts: Record<string, number> = {};

    likedWorks?.forEach((lw) => {
      (lw.work?.tags ?? []).forEach((t: string) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([tag]) => tag);

    if (topTags.length > 0) {
      const { data: rec } = await supabase
        .from("works")
        .select("id, title, description, thumbnail_url, tags, created_at")
        .eq("visibility", "public")
        .contains("tags", topTags)
        .order("created_at", { ascending: false })
        .limit(12);

      recommended = rec ?? [];
    }
  }

  return NextResponse.json({
    latest: latest ?? [],
    popular: popular ?? [],
    recommended,
  });
}
