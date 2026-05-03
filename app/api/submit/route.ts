import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()

  const {
    title,
    description,
    image_url,
    tags = [],
    stacks = [],
    purposes = [],
    focuses = []
  } = body

  // 認証ユーザーを取得
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 作品を作成
  const { data: work, error: workError } = await supabase
    .from("works")
    .insert({
      user_id: user.id,
      title,
      description,
      image_url,
      stacks,
      purposes,
      focuses
    })
    .select()
    .single()

  if (workError) {
    console.error(workError)
    return NextResponse.json({ error: "Failed to create work" }, { status: 500 })
  }

  // タグ処理
  for (const tagName of tags) {
    // タグが存在するか確認
    let { data: tag } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tagName)
      .single()

    // なければ作成
    if (!tag) {
      const { data: newTag } = await supabase
        .from("tags")
        .insert({ name: tagName })
        .select()
        .single()
      tag = newTag
    }

    // work_tags に紐付け
    await supabase.from("work_tags").insert({
      work_id: work.id,
      tag_id: tag.id
    })
  }

  return NextResponse.json({
    success: true,
    work
  })
}
