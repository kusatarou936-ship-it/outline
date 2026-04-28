import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/drizzle/schema";

// Cloudflare Pages / Workers から D1 を扱うためのラッパー
export function getDB(env: { DB: D1Database }) {
  return drizzle(env.DB, { schema });
}

// Next.js (App Router) で使う場合
// app/ 以下の Server Component では process.env ではなく
// runtime の context から env を取得する必要がある。
export function getDBFromContext() {
  // @ts-ignore
  const env = (globalThis as any).__env__ as { DB: D1Database };
  if (!env) {
    throw new Error("D1 binding (env.DB) が見つかりません。");
  }
  return drizzle(env.DB, { schema });
}
