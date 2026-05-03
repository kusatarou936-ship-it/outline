import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { email, password, name } = await req.json()

  // Supabase Auth でユーザー作成
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error || !data.user) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 400 }
    )
  }

  const userId = data.user.id

  // users テーブルにプロフィール初期データを作成
  const { error: profileError } = await supabase
    .from("users")
    .insert({
      id: userId,
      name: name ?? "No Name",
      bio: "",
      links: []
    })

  if (profileError) {
    console.error(profileError)
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    user: data.user,
    session: data.session
  })
}
