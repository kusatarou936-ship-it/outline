export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import OpenAI from "openai";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
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

    if (work.user_id !== user.data.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ★★★ ここで初めて OpenAI を初期化（ビルド時に実行されない） ★★★
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
あなたはサムネイルデザイナーです。
作品の内容をもとに、視認性が高く、シンプルで美しいサムネイルを生成してください。

作品タイトル: ${work.title}
説明文: ${work.description}
本文: ${work.body_markdown ?? ""}
タグ: ${work.tags}

デザイン方針:
- 黒背景ベース
- 余白多め
- 文字は最小限
- 作品の雰囲気を抽象的に表現
`;

    const image = await client.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
    });

    if (!image.data || image.data.length === 0) {
        return NextResponse.json({ error: "No image returned" }, { status: 500 });
    }

    const base64 = image.data[0].b64_json!;
    const buffer = Buffer.from(base64, "base64");

    const filePath = `thumbnails/${workId}-${Date.now()}.png`;

    const { data: upload } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, buffer, {
            contentType: "image/png",
        });

    if (!upload) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const publicUrl = supabase.storage
        .from("thumbnails")
        .getPublicUrl(filePath).data.publicUrl;

    await supabase
        .from("works")
        .update({ thumbnail_url: publicUrl })
        .eq("id", workId);

    return NextResponse.json({ thumbnail_url: publicUrl });
}
