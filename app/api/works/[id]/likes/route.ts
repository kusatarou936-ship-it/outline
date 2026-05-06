import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const workId = params.id;

  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("work_id", workId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let liked = false;

  if (user) {
    const { data: existing } = await supabase
      .from("likes")
      .select("id")
      .eq("work_id", workId)
      .eq("user_id", user.id)
      .maybeSingle();

    liked = !!existing;
  }

  return NextResponse.json({ count: count ?? 0, liked });
}
