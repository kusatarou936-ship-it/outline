import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const formData = await req.formData();

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workId = params.id;

  // 既存データ取得
  const { data: work } = await supabase
    .from("works")
    .select("*")
    .eq("id", workId)
    .single();

  if (!work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 作者チェック
  if (work.user_id !== user.data.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 共通フィールド
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  let updateData: any = {
    title,
    description,
  };

  // internal → Markdown 更新
  if (work.type === "internal") {
    updateData.body_markdown = formData.get("body_markdown") as string;
  }

  // external → URL 更新
  if (work.type === "external") {
    updateData.url = formData.get("url") as string;
  }

  // サムネイル更新
  const thumbnail = formData.get("thumbnail") as File | null;
  if (thumbnail) {
    const fileName = `${Date.now()}-${thumbnail.name}`;

    const { error: uploadError } = await supabase.storage
      .from("thumbnails")
      .upload(fileName, thumbnail);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrl } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(fileName);

    updateData.thumbnail_url = publicUrl.publicUrl;
  }

  // 更新
  const { error: updateError } = await supabase
    .from("works")
    .update(updateData)
    .eq("id", workId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workId = params.id;

  // 作品取得
  const { data: work } = await supabase
    .from("works")
    .select("*")
    .eq("id", workId)
    .single();

  if (!work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 作者チェック
  if (work.user_id !== user.data.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // サムネイルがあれば削除（任意）
  if (work.thumbnail_url) {
    const path = work.thumbnail_url.split("/").slice(-1)[0];
    await supabase.storage.from("thumbnails").remove([`thumbnails/${path}`]);
  }

  // DB から削除
  await supabase.from("works").delete().eq("id", workId);

  return NextResponse.json({ success: true });

  await supabase
    .from("works")
    .update({
      title: body.title,
      description: body.description,
      tags: body.tags,
      body_markdown: body.body_markdown,
      visibility: body.visibility,   // ← 追加
    })
    .eq("id", workId);

  // 現在の状態を履歴として保存
  await supabase.from("work_history").insert({
    work_id: workId,
    user_id: user.data.user.id,
    title: work.title,
    description: work.description,
    body_markdown: work.body_markdown,
    tags: work.tags,
  });
}
