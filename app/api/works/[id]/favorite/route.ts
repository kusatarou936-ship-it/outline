"use server";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { createApiClient } from "@/lib/supabase-api";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  export async function POST(req, { params }) {
    const supabase = createApiClient(req);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workId = params.id;

    // すでにお気に入り済みか確認
    const { data: existing } = await supabase
      .from("favorites")
      .select("*")
      .eq("work_id", workId)
      .eq("user_id", user.data.user.id)
      .maybeSingle();

    if (existing) {
      // お気に入り解除
      await supabase.from("favorites").delete().eq("id", existing.id);
      return NextResponse.json({ favorited: false });
    }

    // 新規お気に入り
    await supabase.from("favorites").insert({
      work_id: workId,
      user_id: user.data.user.id,
    });

    return NextResponse.json({ favorited: true });
  }
