export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase-server";

// コメント一覧（GET）
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("work_id", params.id)
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}

// コメント投稿（POST）
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await supabase.from("comments").insert({
    work_id: params.id,
    user_id: user.id,
    content: body.content,
  });

  return NextResponse.json({ ok: true });
}
