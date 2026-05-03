import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  // 認証ユーザーを取得
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { user: null },
      { status: 200 }
    )
  }

  // プロフィールを取得
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select(`
      id,
      name,
      bio,
      links,
      created_at
    `)
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error(profileError)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      ...profile
    }
  })
}
