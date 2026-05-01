import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
    const API = process.env.NEXT_PUBLIC_API_URL!;
    const BASE = process.env.SITE_URL!;

    const res = await fetch(`${API}/api/works`, { cache: "no-store" });
    const works = await res.json();

    const typedWorks = works as { created_at: string }[];

    const items = typedWorks
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20);


    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Outline – New Works</title>
      <link>${BASE}</link>
      <description>Quiet feed of new works</description>
      ${items
            .map(
                (w: any) => `
        <item>
          <title>${w.title}</title>
          <link>${BASE}/work/${w.id}</link>
          <description>${w.catch}</description>
          <pubDate>${new Date(w.created_at).toUTCString()}</pubDate>
        </item>
      `
            )
            .join("")}
    </channel>
  </rss>`;

    return new NextResponse(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}
