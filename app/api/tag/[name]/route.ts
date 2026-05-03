import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const tagName = decodeURIComponent(params.name)

  // タグを取得
  const { data: tag, error: tagError } = await supabase
    .from("tags")
    .select("id, name")
    .eq("name", tagName)
    .single()

  if (tagError || !tag) {
    console.error(tagError)
    return NextResponse.json({ error: "Tag not found" }, { status: 404 })
  }

  // タグに紐づく作品を取得
  const { data: works, error: worksError } = await supabase
    .from("work_tags")
    .select(`
      work:works(
        id,
        title,
        description,
        image_url,
        created_at,
        user:users(id, name),
        work_tags(
          tag:tags(name)
        )
      )
    `)
    .eq("tag_id", tag.id)
    .order("work.created_at", { ascending: false })

  if (worksError) {
    console.error(worksError)
    return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 })
  }

  // work_tags 経由なので { work: {...} } の形 → 平坦化
  const flatWorks = works.map((w: any) => w.work)

  return NextResponse.json({
    tag,
    works: flatWorks,
  })
}
