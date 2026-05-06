"use server";

import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase-api";

// GET: 作品取得
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);

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

// POST: 作品更新
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);
  const formData = await req.formData();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workId = params.id;

  const { data: work } = await supabase
    .from("works")
    .select("*")
    .eq("id", workId)
    .single();

  if (!work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (work.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  let updateData: any = { title, description };

  if (work.type === "internal") {
    updateData.body_markdown = formData.get("body_markdown") as string;
  }

  if (work.type === "external") {
    updateData.url = formData.get("url") as string;
  }

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

  const { error: updateError } = await supabase
    .from("works")
    .update(updateData)
    .eq("id", workId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE: 作品削除
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workId = params.id;

  const { data: work } = await supabase
    .from("works")
    .select("*")
    .eq("id", workId)
    .single();

  if (!work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (work.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (work.thumbnail_url) {
    const path = work.thumbnail_url.split("/").slice(-1)[0];
    await supabase.storage.from("thumbnails").remove([path]);
  }

  await supabase.from("works").delete().eq("id", workId);

  return NextResponse.json({ success: true });
}
