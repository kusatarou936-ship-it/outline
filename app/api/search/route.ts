import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim() ?? ""

  if (!q) {
    return NextResponse.json({ results: [] })
  }

  // タイトル・説明・タグ・作者名を横断検索
  const { data: works, error } = await supabase
    .from("works")
    .select(`
      id,
      title,
      description,
      image_url,
      created_at,
      user:users(id, name),
      work_tags(
        tag:tags(name)
      )
    `)
    .or(`
      title.ilike.%${q}%,
      description.ilike.%${q}%,
      user.name.ilike.%${q}%,
      work_tags.tag.name.ilike.%${q}%
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }

  return NextResponse.json({
    query: q,
    results: works,
  })
}
