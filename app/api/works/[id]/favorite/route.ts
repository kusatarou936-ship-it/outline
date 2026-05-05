"use server";

import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase-api";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workId = params.id;

  const { data: existing } = await supabase
    .from("favorites")
    .select("*")
    .eq("work_id", workId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return NextResponse.json({ favorited: false });
  }

  await supabase.from("favorites").insert({
    work_id: workId,
    user_id: user.id,
  });

  return NextResponse.json({ favorited: true });
}
