import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const userId = params.id;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, name, bio, links, created_at")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: works, error: worksError } = await supabase
    .from("works")
    .select(`
      id,
      title,
      description,
      image_url,
      created_at,
      work_tags(tag:tags(name))
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (worksError) {
    return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 });
  }

  return NextResponse.json({ user, works });
}
