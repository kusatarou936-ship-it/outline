"use server";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json([], { status: 200 });
  }

  const { data } = await supabase
    .from("work_history")
    .select("*")
    .eq("work_id", params.id)
    .eq("user_id", user.data.user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}
