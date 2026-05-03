import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // 最新の作品（新着）
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

  // 最近更新された作品
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

  // 全作品を取得してタグ集計
  const { data: allWorks } = await supabase
    .from("works")
    .select(`
      id,
      stacks,
      purposes,
      focuses
    `);

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
    newWorks,
    updatedWorks,
    newUsers,
  });
}
