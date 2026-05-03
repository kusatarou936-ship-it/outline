import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id

  // ユーザー情報を取得
  const { data: user, error: userError } = await supabase
    .from("users")
    .select(`
      id,
      name,
      bio,
      links,
      created_at
    `)
    .eq("id", userId)
    .single()

  if (userError || !user) {
    console.error(userError)
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // ユーザーの作品一覧を取得
  const { data: works, error: worksError } = await supabase
    .from("works")
    .select(`
      id,
      title,
      description,
      image_url,
      created_at,
      work_tags(
        tag:tags(name)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (worksError) {
    console.error(worksError)
    return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 })
  }

  return NextResponse.json({
    user,
    works,
  })
}
