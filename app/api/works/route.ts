import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase-api";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const supabase = createApiClient(req);

    const { data: works, error } = await supabase
      .from("works")
      .select("id, title, description, thumbnail_url")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("SUPABASE_ERROR", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(works);
  } catch (e: any) {
    console.error("API_WORKS_FATAL", e);
    return NextResponse.json(
      { error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
