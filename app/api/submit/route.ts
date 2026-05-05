import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { generateShortId } from "@/lib/generateShortId";

export async function POST(req: Request) {
  const supabase = createClient();
  const formData = await req.formData();

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.data.user.id;

  // 共通フィールド
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tags = (formData.get("tags") as string)?.split(",") ?? [];

  // 投稿タイプ
  const type = formData.get("type") as "external" | "internal";

  let url: string | null = null;
  let body_markdown: string | null = null;
  let generated_url: string | null = null;

  // 外部URL作品
  if (type === "external") {
    url = formData.get("url") as string;
  }

  // 内部生成作品
  if (type === "internal") {
    body_markdown = formData.get("body_markdown") as string;
  }

  // サムネイルアップロード
  const thumbnail = formData.get("thumbnail") as File | null;
  let thumbnail_url: string | null = null;

  if (thumbnail) {
    const fileName = `${Date.now()}-${thumbnail.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("thumbnails")
      .upload(fileName, thumbnail);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrl } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(fileName);

    thumbnail_url = publicUrl.publicUrl;
  }

  // 作品を保存
  const { data, error } = await supabase
    .from("works")
    .insert({
      user_id: userId,
      title,
      description,
      tags,
      type,
      url,
      body_markdown,
      thumbnail_url,
    })
    .select()
    .single();

  // 作品を保存した直後の部分に追加
  if (type === "internal") {
    const shortId = generateShortId();

    await supabase
      .from("works")
      .update({
        generated_url: `/i/${shortId}`,
        short_id: shortId,
      })
      .eq("id", data.id);
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 内部生成作品は URL を後から生成
  if (type === "internal") {
    generated_url = `/work/${data.id}`;

    await supabase
      .from("works")
      .update({ generated_url })
      .eq("id", data.id);
  }

  return NextResponse.json({ id: data.id });
}
