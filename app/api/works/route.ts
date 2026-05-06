import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase-api";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = createApiClient(req);

  const { data: works, error } = await supabase
    .from("works")
    .select("id, title, description, thumbnail_url")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(works);
}
