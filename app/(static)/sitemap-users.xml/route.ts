import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  const API = process.env.NEXT_PUBLIC_API_BASE;
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${API}/api/users`, { cache: "no-store" });
  const users = await res.json();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${users
      .map(
        (u: any) => `
      <url>
        <loc>${base}/user/${u.id}</loc>
      </url>
    `
      )
      .join("")}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
