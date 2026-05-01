import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  const API = process.env.NEXT_PUBLIC_API_BASE;
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${API}/api/works`, { cache: "no-store" });
  const works = await res.json();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${works
      .map(
        (w: any) => `
      <url>
        <loc>${base}/work/${w.id}</loc>
      </url>
    `
      )
      .join("")}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
