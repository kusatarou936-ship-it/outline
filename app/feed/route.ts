import { NextResponse } from "next/server";
import { getDBFromContext } from "@/lib/db";
import { works } from "@/drizzle/schema";

export const dynamic = "force-dynamic";
export async function GET() {
  const db = getDBFromContext();

  const allWorks = await db
    .select()
    .from(works)
    .orderBy(works.createdAt);

  const feed = {
    version: "https://jsonfeed.org/version/1",
    title: "Outline – New Works",
    home_page_url: "https://your-domain.com",
    feed_url: "https://your-domain.com/feed.json",
    items: allWorks.map((w) => ({
      id: w.id,
      url: `https://your-domain.com/work/${w.id}`,
      title: w.title,
      content_text: w.catch ?? "",
      date_published: w.createdAt,
    })),
  };

  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
