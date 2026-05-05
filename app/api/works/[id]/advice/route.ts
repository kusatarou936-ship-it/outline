export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import OpenAI from "openai";

async function generateAdvice(work: any) {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
あなたは作品レビューではなく、作者のためのアドバイザーです。
作品を評価したり、順位をつけたりしてはいけません。
批判ではなく、改善のための建設的な提案だけを行ってください。

以下の5つの観点でアドバイスを生成してください：

1. 説明文の改善ポイント
2. タグの最適化（3〜5個の候補）
3. サムネイル改善案
4. 作品の強みの言語化
5. 初見ユーザーが迷いそうな点の指摘

出力は必ず次の JSON 形式で返してください：

{
  "description": "...",
  "tags": "...",
  "thumbnail": "...",
  "strengths": "...",
  "confusion": "..."
}

作品データ：
タイトル: ${work.title}
説明文: ${work.description}
本文: ${work.body_markdown ?? work.url}
タグ: ${work.tags}
サムネイル: ${work.thumbnail_url}
`;

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
}

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

    if (work.advice) {
        return NextResponse.json({ advice: work.advice });
    }

    const advice = await generateAdvice(work);

    await supabase
        .from("works")
        .update({ advice })
        .eq("id", workId);

    return NextResponse.json({ advice });
}