import { getDBFromContext } from "@/lib/db";

export async function GET() {
  const db = getDBFromContext();

  const allWorks = await db
    .select()
    .from(works)
    .orderBy(works.createdAt);

  const items = allWorks
    .map(
      (w) => `
      <item>
        <title><![CDATA[${w.title}]]></title>
        <link>https://your-domain.com/work/${w.id}</link>
        <description><![CDATA[${w.catch ?? ""}]]></description>
        <pubDate>${new Date(w.createdAt).toUTCString()}</pubDate>
      </item>
    `
    )
    .join("");

  const xml = `
    <rss version="2.0">
      <channel>
        <title>Outline – New Works</title>
        <link>https://your-domain.com</link>
        <description>New works added to Outline</description>
        ${items}
      </channel>
    </rss>
  `.trim();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=300",
    },
  });
}
