"use server";

import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase-api";

// POST: コメント投稿
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);
  const body = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!body.content || body.content.trim() === "")
    return NextResponse.json({ error: "Empty comment" }, { status: 400 });

  await supabase.from("comments").insert({
    work_id: params.id,
    user_id: user.id,
    content: body.content,
    reply_to: body.reply_to ?? null,
  });

  return NextResponse.json({ success: true });
}

// GET: コメント取得
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);

  const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("work_id", params.id)
    .order("created_at", { ascending: true });

  const list = data ?? [];

  const parents = list.filter((c) => !c.reply_to);
  const replies = list.filter((c) => c.reply_to);

  const tree = parents.map((p) => ({
    ...p,
    replies: replies.filter((r) => r.reply_to === p.id),
  }));

  return NextResponse.json(tree);
}
