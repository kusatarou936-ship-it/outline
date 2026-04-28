// workers/ogp.ts
// Outline: OGP 自動生成 Worker（骨格完成版）

import { extractLang, detectStack } from "./utils";

export interface Env {
  DB: D1Database;
  BROWSER: any;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const url = new URL(request.url);

  const workId = url.searchParams.get("id");
  if (!workId) {
    return new Response("Missing id", { status: 400 });
  }

  try {
    // ----------------------------------------
    // 1. DB から作品情報を取得
    // ----------------------------------------
    const work = await env.DB.prepare(
      `SELECT title, description, stack FROM works WHERE id = ?1`
    )
      .bind(workId)
      .first();

    if (!work) {
      return new Response("Not found", { status: 404 });
    }

    // ----------------------------------------
    // 2. HTML テンプレート生成（静かで均一）
    // ----------------------------------------
    const html = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              width: 1200px;
              height: 630px;
              background: #f9f5ef;
              font-family: system-ui, sans-serif;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding: 80px;
            }
            h1 {
              font-size: 64px;
              margin: 0 0 20px 0;
              color: #1a1a1a;
            }
            p {
              font-size: 28px;
              color: #444;
              margin: 0 0 40px 0;
            }
            .stack {
              font-size: 24px;
              color: #777;
            }
            .logo {
              position: absolute;
              bottom: 40px;
              right: 40px;
              font-size: 24px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <h1>${escapeHTML(work.title)}</h1>
          <p>${escapeHTML(work.description || "")}</p>
          <div class="stack">${escapeHTML(work.stack || "")}</div>
          <div class="logo">Outline</div>
        </body>
      </html>
    `;

    // ----------------------------------------
    // 3. Browser Rendering API で画像化
    // ----------------------------------------
    const browser = await env.BROWSER.newContext({
      viewport: { width: 1200, height: 630 },
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "load" });

    const image = await page.screenshot({
      type: "jpeg",
      quality: 90,
    });

    await browser.close();

    // ----------------------------------------
    // 4. 画像を返す（キャッシュ 1日）
    // ----------------------------------------
    return new Response(image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("[ogp.ts] error:", err);
    return new Response("error", { status: 200 });
  }
};

// ----------------------------------------
// HTML エスケープ（安全）
// ----------------------------------------
function escapeHTML(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
