import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// works（主観データ）
export const works = sqliteTable("works", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  title: text("title").notNull(),
  catch: text("catch"),
  url: text("url").notNull(),
  thumbnail: text("thumbnail"), // R2 URL（自動生成）

  // 文脈（主観）
  purpose: text("purpose"),
  target: text("target"),
  focus: text("focus"),

  status: text("status").notNull(), // prototype / beta / release

  // 技術スタック（主観）
  stack: text("stack", { mode: "json" }).$type<string[]>(),

  github: text("github"),

  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// auto_metrics（客観データ）
export const autoMetrics = sqliteTable("auto_metrics", {
  workId: text("work_id")
    .primaryKey()
    .references(() => works.id),

  performance: integer("performance"),
  a11y: integer("a11y"),
  mobile: integer("mobile"),
  ssl: integer("ssl"),
  i18n: integer("i18n"),

  detectedStack: text("detected_stack", { mode: "json" }).$type<string[]>(),
});

// users（投稿者）
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  links: text("links", { mode: "json" }).$type<string[]>(),
});
