import { readFileSync } from "fs";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/d1";
import { works } from "@/drizzle/schema";

// Cloudflare の D1 をローカルで扱うための設定
// wrangler.toml の設定に合わせてパスを指定
const DB_PATH = resolve(".wrangler", "state", "d1", "outline-db", "sqlite.db");

async function main() {
  console.log("📦 projects.json を読み込み中…");

  const jsonPath = resolve("data", "projects.json");
  const raw = readFileSync(jsonPath, "utf-8");
  const projects = JSON.parse(raw);

  // D1 に接続
  const sqlite = require("better-sqlite3")(DB_PATH);
  const db = drizzle(sqlite);

  console.log(`🗂 ${projects.length} 件の作品を同期します…`);

  for (const p of projects) {
    console.log(`→ ${p.id} を同期中…`);

    await db
      .insert(works)
      .values({
        id: p.id,
        userId: "system",
        title: p.title,
        catch: p.catch ?? null,
        url: p.url,
        purpose: p.purpose ?? null,
        target: p.target ?? null,
        focus: p.focus ?? null,
        status: p.status,
        stack: p.stack ?? [],
        github: p.github ?? null,
      })
      .onConflictDoUpdate({
        target: works.id,
        set: {
          title: p.title,
          catch: p.catch ?? null,
          url: p.url,
          purpose: p.purpose ?? null,
          target: p.target ?? null,
          focus: p.focus ?? null,
          status: p.status,
          stack: p.stack ?? [],
          github: p.github ?? null,
        },
      });
  }

  console.log("✅ 同期完了！");
  console.log("🖼 サムネイル生成 Worker が自動で動きます");
  console.log("🔍 自動解析 Worker も順次実行されます");
}

main().catch((err) => {
  console.error("❌ エラー:", err);
  process.exit(1);
});
