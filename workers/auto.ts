// workers/auto.ts
// Outline: auto_metrics 自動解析 Worker（骨格完成版）

export interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const url = new URL(request.url);

  const workId = url.searchParams.get("work_id");
  const target = url.searchParams.get("url");

  if (!workId || !target) {
    return new Response("Missing params", { status: 400 });
  }

  try {
    // ----------------------------------------
    // 1. HTML 取得（fetchHTML は utils に切り出す）
    // ----------------------------------------
    const html = await fetch(target).then((r) => r.text());

    // ----------------------------------------
    // 2. 解析（まだダミー。後で本物のロジックを入れる）
    // ----------------------------------------
    // 2. Browser Rendering API で解析
    const browser = await env.BROWSER.newContext();
    const page = await browser.newPage();

    await page.goto(target, { waitUntil: "load", timeout: 8000 });

    // パフォーマンス（簡易）
    const perf = await page.evaluate(() => performance.now());

    // a11y（img alt の有無など）
    const a11y = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll("img")];
      const missingAlt = imgs.filter(img => !img.alt).length;
      return missingAlt === 0 ? 100 : 60;
    });

    // モバイル最適化（viewport 判定）
    const mobile = await page.evaluate(() => {
      const vp = document.querySelector("meta[name=viewport]");
      return vp ? 100 : 50;
    });

    await browser.close();

    const metrics = {
      work_id: workId,
      performance: perf,
      a11y,
      mobile,
      ssl: target.startsWith("https://"),
      i18n: extractLang(html),
      detected_stack: detectStack(html),
    };

    // ----------------------------------------
    // 3. D1 に upsert（auto_metrics）
    // ----------------------------------------
    await env.DB.prepare(
      `INSERT INTO auto_metrics (work_id, performance, a11y, mobile, ssl, i18n, detected_stack)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
       ON CONFLICT(work_id) DO UPDATE SET
         performance=?2, a11y=?3, mobile=?4, ssl=?5, i18n=?6, detected_stack=?7`
    )
      .bind(
        workId,
        metrics.performance,
        metrics.a11y,
        metrics.mobile,
        metrics.ssl,
        metrics.i18n,
        JSON.stringify(metrics.detected_stack)
      )
      .run();

    return new Response("ok", { status: 200 });
  } catch (err) {
    // ----------------------------------------
    // 静かに失敗（Outline の哲学）
    // ----------------------------------------
    console.error("[auto.ts] error:", err);
    return new Response("error", { status: 200 });
  }
};

// ----------------------------------------
// utils（後で workers/utils.ts に分離する）
// ----------------------------------------
function extractLang(html: string): string | null {
  const match = html.match(/<html[^>]*lang="([^"]+)"/i);
  return match ? match[1] : null;
}

function detectStack(html: string): string[] {
  const stack: string[] = [];

  if (html.includes("Next.js")) stack.push("Next.js");
  if (html.includes("React")) stack.push("React");
  if (html.includes("Vue")) stack.push("Vue");
  if (html.includes("Svelte")) stack.push("Svelte");

  return stack;
}
