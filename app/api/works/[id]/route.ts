export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// GET: 作品取得（公開作品は誰でも見れる）
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: work, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 公開作品なら誰でもOK
  if (work.visibility === "public") {
    return NextResponse.json(work);
  }

  // 非公開作品は本人のみ
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== work.user_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(work);
}

// PUT: 作品編集（本人のみ）
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

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

  const body = await req.json();

  const { error: updateError } = await supabase
    .from("works")
    .update({
      title: body.title,
      description: body.description,
      body_markdown: body.body_markdown,
      tags: body.tags,
      visibility: body.visibility,
      thumbnail_url: body.thumbnail_url,
    })
    .eq("id", workId);

  if (updateError) {
    console.error(updateError);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE: 作品削除（本人のみ）
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workId = params.id;

  const { data: work } = await supabase
    .from("works")
    .select("user_id")
    .eq("id", workId)
    .single();

  if (!work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (work.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await supabase.from("works").delete().eq("id", workId);

  return NextResponse.json({ ok: true });
}
