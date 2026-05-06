export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // クエリパラメータ
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? 50);
    const page = Number(searchParams.get("page") ?? 1);
    const tag = searchParams.get("tag");
    const keyword = searchParams.get("q");
    const userId = searchParams.get("user_id");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("works")
      .select("id, title, description, thumbnail_url, tags, user_id, created_at")
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,description.ilike.%${keyword}%`
      );
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: works, error } = await query;

    if (error) {
      console.error("SUPABASE_ERROR", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      page,
      limit,
      works: works ?? [],
    });
  } catch (e: any) {
    console.error("API_WORKS_FATAL", e);
    return NextResponse.json(
      { error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
