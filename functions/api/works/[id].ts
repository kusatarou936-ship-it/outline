import { drizzle } from "drizzle-orm/d1";
import { works, autoMetrics } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const onRequest: PagesFunction = async ({ env, params }) => {
  const db = drizzle(env.DB);

  const [work] = await db
    .select()
    .from(works)
    .where(eq(works.id, params.id));

  if (!work) {
    return new Response("Not found", { status: 404 });
  }

  const [auto] = await db
    .select()
    .from(autoMetrics)
    .where(eq(autoMetrics.workId, params.id));

  return new Response(JSON.stringify({ work, auto }), {
    headers: { "Content-Type": "application/json" },
  });
};
