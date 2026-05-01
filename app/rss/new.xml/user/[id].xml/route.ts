import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(req: Request, { params }: any) {
  const API = process.env.NEXT_PUBLIC_API_BASE;
  const BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${API}/api/user/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { user, works } = await res.json();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Outline – User: ${user.name}</title>
      <link>${BASE}/user/${user.id}</link>
      <description>Quiet feed for user: ${user.name}</description>
      ${works
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
