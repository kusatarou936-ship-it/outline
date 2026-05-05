import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("work_id", params.id);

  return NextResponse.json({ count });
}
