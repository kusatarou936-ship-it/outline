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

  const userId = params.id;

  // 1. ユーザー情報
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, bio, created_at")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 2. 公開作品一覧
  const { data: works } = await supabase
    .from("works")
    .select("id, title, description, thumbnail_url, tags, created_at")
    .eq("user_id", userId)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  // 3. 人気作品（いいね数順）
  const { data: popular } = await supabase
    .from("works")
    .select("id, title, thumbnail_url, created_at, likes(count)")
    .eq("user_id", userId)
    .eq("visibility", "public")
    .order("likes.count", { ascending: false })
    .limit(6);

  // 4. タグ傾向（作品の tags を集計）
  const tagCounts: Record<string, number> = {};

  works?.forEach((w) => {
    (w.tags ?? []).forEach((t: string) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  // 5. 総いいね数
  const { count: totalLikes } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("work_id", works?.map((w) => w.id) ?? []);

  // 6. 総お気に入り数
  const { count: totalFavorites } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("work_id", works?.map((w) => w.id) ?? []);

  return NextResponse.json({
    profile,
    works: works ?? [],
    popular: popular ?? [],
    topTags,
    stats: {
      totalLikes: totalLikes ?? 0,
      totalFavorites: totalFavorites ?? 0,
      totalWorks: works?.length ?? 0,
    },
  });
}
