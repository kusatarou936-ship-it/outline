// workers/thumbnail.ts
// Outline: サムネイル自動生成 Worker（骨格完成版）

import { saveToR2 } from "./utils";

export interface Env {
  DB: D1Database;
  R2: R2Bucket;
  BROWSER: any;
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
    // 1. Browser Rendering API でページを開く
    // ----------------------------------------
    const browser = await env.BROWSER.newContext({
      viewport: { width: 1280, height: 720 },
    });
    const page = await browser.newPage();

    await page.goto(target, { waitUntil: "load", timeout: 8000 });

    // ----------------------------------------
    // 2. スクリーンショット（1280×720）
    // ----------------------------------------
    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 80,
    });

    await browser.close();

    // ----------------------------------------
    // 3. R2 に保存
    // ----------------------------------------
    const key = `thumbnails/${workId}.jpg`;
    await saveToR2(env.R2, key, new Blob([screenshot]));

    // ----------------------------------------
    // 4. works.thumbnail を更新
    // ----------------------------------------
    const publicUrl = `https://YOUR_R2_PUBLIC_DOMAIN/${key}`;

    await env.DB.prepare(
      `UPDATE works SET thumbnail = ?1 WHERE id = ?2`
    )
      .bind(publicUrl, workId)
      .run();

    return new Response("ok", { status: 200 });
  } catch (err) {
    // ----------------------------------------
    // 静かに失敗（Outline の哲学）
    // ----------------------------------------
    console.error("[thumbnail.ts] error:", err);
    return new Response("error", { status: 200 });
  }
};
