import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  const API = process.env.NEXT_PUBLIC_API_BASE;
  const BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${API}/api/works`, { cache: "no-store" });
  const works = await res.json();

  const items = works
    .filter((w: any) => w.updated_at !== w.created_at)
    .sort((a: any, b: any) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 20);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Outline – Updated Works</title>
      <link>${BASE}</link>
      <description>Quiet feed of recently updated works</description>
      ${items
        .map(
          (w: any) => `
        <item>
          <title>${w.title}</title>
          <link>${BASE}/work/${w.id}</link>
          <description>${w.catch}</description>
          <pubDate>${new Date(w.updated_at).toUTCString()}</pubDate>
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
