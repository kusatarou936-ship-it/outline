import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
    const BASE = process.env.SITE_URL!;

    const urls = [
        "",
        "/works",
        "/feed",
        "/search",
        "/dashboard",
        "/submit",
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
            .map(
                (u) => `
      <url>
        <loc>${base}${u}</loc>
      </url>
    `
            )
            .join("")}
  </urlset>`;

    return new NextResponse(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}
