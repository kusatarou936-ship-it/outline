"use server";

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createApiClient } from "@/lib/supabase-api";

async function generateAdvice(work: any) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
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

出力は JSON 形式で返してください。

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

// POST: アドバイス生成（作者のみ）
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workId = params.id;

  const { data: work } = await supabase
    .from("works")
    .select("*")
    .eq("id", workId)
    .single();

  if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (work.user_id !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (work.advice) return NextResponse.json({ advice: work.advice });

  const advice = await generateAdvice(work);

  await supabase.from("works").update({ advice }).eq("id", workId);

  return NextResponse.json({ advice });
}

// GET: アドバイス取得（誰でも）
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createApiClient(req);

  const { data: work, error } = await supabase
    .from("works")
    .select("advice")
    .eq("id", params.id)
    .single();

  if (error || !work)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ advice: work.advice ?? null });
}
