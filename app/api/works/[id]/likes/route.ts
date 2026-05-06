"use server";

import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase-api";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const workId = params.id;

  // いいね数
  const { count, error: countError } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("work_id", workId);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  let liked = false;

  if (user) {
    const { data: myLike } = await supabase
      .from("likes")
      .select("id")
      .eq("work_id", workId)
      .eq("user_id", user.id)
      .maybeSingle();

    liked = !!myLike;
  }

  return NextResponse.json({ count: count ?? 0, liked });
}
