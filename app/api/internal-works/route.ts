import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createClient();

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json([], { status: 200 });
  }

  const { data } = await supabase
    .from("works")
    .select("*")
    .eq("user_id", user.data.user.id)
    .eq("type", "internal")
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}
