"use server";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await req.json();

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: history } = await supabase
    .from("work_history")
    .select("*")
    .eq("id", body.history_id)
    .single();

  if (!history) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await supabase
    .from("works")
    .update({
      title: history.title,
      description: history.description,
      body_markdown: history.body_markdown,
      tags: history.tags,
    })
    .eq("id", params.id);

  return NextResponse.json({ success: true });
}
