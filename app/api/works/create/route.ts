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

  const title = body.title?.trim();
  const description = body.description?.trim() ?? "";
  const bodyMarkdown = body.body_markdown?.trim();
  const tags = Array.isArray(body.tags) ? body.tags : [];
  const visibility = body.visibility ?? "public";
  const thumbnailUrl = body.thumbnail_url ?? null;

  // バリデーション
  if (!title || title.length < 1) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!bodyMarkdown || bodyMarkdown.length < 1) {
    return NextResponse.json({ error: "Body is required" }, { status: 400 });
  }

  if (!["public", "private"].includes(visibility)) {
    return NextResponse.json({ error: "Invalid visibility" }, { status: 400 });
  }

  // 投稿
  const { data: work, error } = await supabase
    .from("works")
    .insert({
      user_id: user.id,
      title,
      description,
      body_markdown: bodyMarkdown,
      tags,
      visibility,
      thumbnail_url: thumbnailUrl,
    })
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ work });
}
