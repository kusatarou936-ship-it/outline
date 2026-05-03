import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // 認証ユーザーを取得
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`

  // Supabase Storage にアップロード
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      contentType: file.type
    })

  if (uploadError) {
    console.error(uploadError)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  // 公開 URL を取得
  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName)

  return NextResponse.json({
    success: true,
    url: urlData.publicUrl
  })
}
