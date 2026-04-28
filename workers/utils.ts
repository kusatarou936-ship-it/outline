// workers/utils.ts
// Outline Workers 共通ユーティリティ（静か・均一・壊れない）

// ----------------------------------------
// HTML 取得（redirect follow + timeout）
// ----------------------------------------
export async function fetchHTML(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

// ----------------------------------------
// <html lang=""> 抽出
// ----------------------------------------
export function extractLang(html: string): string | null {
  const match = html.match(/<html[^>]*lang="([^"]+)"/i);
  return match ? match[1] : null;
}

// ----------------------------------------
// 技術スタック検出（静かで控えめ）
// ----------------------------------------
export function detectStack(html: string): string[] {
  const stack: string[] = [];

  if (/next/i.test(html)) stack.push("Next.js");
  if (/react/i.test(html)) stack.push("React");
  if (/vue/i.test(html)) stack.push("Vue");
  if (/svelte/i.test(html)) stack.push("Svelte");
  if (/astro/i.test(html)) stack.push("Astro");

  return stack;
}

// ----------------------------------------
// R2 保存（壊れない）
// ----------------------------------------
export async function saveToR2(
  bucket: R2Bucket,
  key: string,
  blob: Blob
): Promise<void> {
  await bucket.put(key, blob, {
    httpMetadata: {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
}

// ----------------------------------------
// D1 更新（upsert）
// ----------------------------------------
export async function upsertAutoMetrics(env: any, metrics: any) {
  await env.DB.prepare(
    `INSERT INTO auto_metrics (work_id, performance, a11y, mobile, ssl, i18n, detected_stack)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     ON CONFLICT(work_id) DO UPDATE SET
       performance=?2, a11y=?3, mobile=?4, ssl=?5, i18n=?6, detected_stack=?7`
  )
    .bind(
      metrics.work_id,
      metrics.performance,
      metrics.a11y,
      metrics.mobile,
      metrics.ssl,
      metrics.i18n,
      JSON.stringify(metrics.detected_stack)
    )
    .run();
}
