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

  // 元作品を取得
  const { data: work, error: workError } = await supabase
    .from("works")
    .select("tags, title")
    .eq("id", workId)
    .single();

  if (workError || !work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tags = work.tags ?? [];

  // タグ一致の関連作品
  let query = supabase
    .from("works")
    .select("id, title, description, thumbnail_url, tags")
    .eq("visibility", "public")
    .neq("id", workId)
    .limit(6);

  if (tags.length > 0) {
    query = query.contains("tags", tags.slice(0, 1)); // 代表タグ1つで十分
  }

  const { data: related, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // タグ一致が少なすぎる場合 → タイトル部分一致で補完
  let results = related ?? [];

  if (results.length < 6) {
    const { data: fallback } = await supabase
      .from("works")
      .select("id, title, description, thumbnail_url, tags")
      .eq("visibility", "public")
      .neq("id", workId)
      .ilike("title", `%${work.title.split(" ")[0]}%`)
      .limit(6 - results.length);

    results = [...results, ...(fallback ?? [])];
  }

  return NextResponse.json(results);
}
