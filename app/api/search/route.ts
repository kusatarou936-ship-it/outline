import { NextResponse } from "next/server";
import { getDBFromContext } from "@/lib/db";
import { works } from "@/drizzle/schema";
import { like, or } from "drizzle-orm";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const db = getDBFromContext();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  if (!q) {
    return NextResponse.json([]);
  }

  const keyword = `%${q}%`;

  const result = await db
    .select({
      id: works.id,
      title: works.title,
      catch: works.catch,
      thumbnail: works.thumbnail,
      stack: works.stack,
    })
    .from(works)
    .where(
      or(
        like(works.title, keyword),
        like(works.catch, keyword),
        like(works.stack, keyword) // JSON 文字列として部分一致
      )
    );

  return NextResponse.json(result);
}
