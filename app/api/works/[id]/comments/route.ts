import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const body = await req.json();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!body.content || body.content.trim() === "") {
        return NextResponse.json({ error: "Empty comment" }, { status: 400 });
    }

    await supabase.from("comments").insert({
        work_id: params.id,
        user_id: user.data.user.id,
        content: body.content,
        reply_to: body.reply_to ?? null,
    });


    return NextResponse.json({ success: true });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();

    const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("work_id", params.id)
        .order("created_at", { ascending: true });

    // 親コメントと返信を分ける
    const list = data ?? [];

    const parents = list.filter((c) => !c.reply_to);
    const replies = list.filter((c) => c.reply_to);

    // 親コメントに replies を紐づける
    const tree = parents.map((p) => ({
        ...p,
        replies: replies.filter((r) => r.reply_to === p.id),
    }));

    return NextResponse.json(tree);
}

