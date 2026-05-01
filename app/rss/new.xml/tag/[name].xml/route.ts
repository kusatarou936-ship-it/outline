import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(req: Request, { params }: any) {
  const API = process.env.NEXT_PUBLIC_API_BASE;
  const BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const tag = decodeURIComponent(params.name);

  const res = await fetch(`${API}/api/tag?tag=${tag}&type=stack`, {
    cache: "no-store",
  });

  const items = res.ok ? await res.json() : [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Outline – Tag: ${tag}</title>
      <link>${BASE}/tag/${tag}</link>
      <description>Quiet feed for tag: ${tag}</description>
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
