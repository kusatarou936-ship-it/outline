import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const workId = params.id

  // 作品本体
  const { data: work, error: workError } = await supabase
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
    .eq("id", workId)
    .single()

  if (workError || !work) {
    return NextResponse.json({ error: "Work not found" }, { status: 404 })
  }

  // アクセス解析
  const userAgent = req.headers.get("user-agent") ?? "unknown"
  await supabase.from("analytics").insert({
    work_id: workId,
    user_agent: userAgent,
  })

  // 関連作品は一旦空で返す（後で実装）
  const related = []

  return NextResponse.json({
    work,
    related,
  })
}
