import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  // サーバー側専用 Supabase クライアント（RLS バイパス）
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 新着作品
  const { data: newWorks } = await supabase
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
    .limit(6);

  // 更新された作品
  const { data: updatedWorks } = await supabase
    .from("works")
    .select(`
      id,
      title,
      description,
      image_url,
      updated_at,
      user:users(id, name),
      work_tags(tag:tags(name))
    `)
    .order("updated_at", { ascending: false })
    .limit(6);

  // 新規ユーザー
  const { data: newUsers } = await supabase
    .from("users")
    .select("id, name, created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  // タグ集計用に全作品取得
  const { data: allWorks } = await supabase
    .from("works")
    .select("id, stacks, purposes, focuses");

  const stacks: Record<string, number> = {};
  const purposes: Record<string, number> = {};
  const focuses: Record<string, number> = {};

  for (const w of allWorks ?? []) {
    for (const s of w.stacks ?? []) stacks[s] = (stacks[s] ?? 0) + 1;
    for (const p of w.purposes ?? []) purposes[p] = (purposes[p] ?? 0) + 1;
    for (const f of w.focuses ?? []) focuses[f] = (focuses[f] ?? 0) + 1;
  }

  return NextResponse.json({
    stacks,
    purposes,
    focuses,
    newWorks: newWorks ?? [],
    updatedWorks: updatedWorks ?? [],
    newUsers: newUsers ?? []
  });
}
