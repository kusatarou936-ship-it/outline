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

  const { count, error: countError } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("work_id", workId);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  let favorited = false;

  if (user) {
    const { data: myFav } = await supabase
      .from("favorites")
      .select("id")
      .eq("work_id", workId)
      .eq("user_id", user.id)
      .maybeSingle();

    favorited = !!myFav;
  }

  return NextResponse.json({ count: count ?? 0, favorited });
}
