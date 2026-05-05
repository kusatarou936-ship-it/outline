import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { tag: string } }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .contains("tags", [params.tag])
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
