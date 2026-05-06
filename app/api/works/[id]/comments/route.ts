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

  // 作品の公開状態を確認
  const { data: work } = await supabase
    .from("works")
    .select("visibility, user_id")
    .eq("id", workId)
    .single();

  if (!work) {
    return NextResponse.json({ error: "Work not found" }, { status: 404 });
  }

  // 非公開作品 → 作者以外はコメントを見れない
  if (work.visibility !== "public") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== work.user_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // コメント一覧取得（親コメント + 返信）
  const { data: comments, error } = await supabase
    .from("comments")
    .select("id, user_id, content, parent_id, created_at")
    .eq("work_id", workId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 階層構造に変換
  const map: Record<string, any> = {};
  const roots: any[] = [];

  comments?.forEach((c) => {
    map[c.id] = { ...c, replies: [] };
  });

  comments?.forEach((c) => {
    if (c.parent_id) {
      map[c.parent_id]?.replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return NextResponse.json(roots);
}
