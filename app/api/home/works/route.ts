import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(req: Request) {
  const supabase = createClient();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: works, error } = await supabase
    .from("works")
    .select(`
      id,
      title,
      description,
      image_url,
      created_at,
      user:users(id, name),
      work_tags(tag:tags(name))
    `)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 });
  }

  return NextResponse.json({ page, limit, works });
}
