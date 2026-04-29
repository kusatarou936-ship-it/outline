import { drizzle } from "drizzle-orm/d1";
import { works } from "../../drizzle/schema";

export const onRequest: PagesFunction = async ({ env }) => {
  const db = drizzle(env.DB);

  const all = await db.select().from(works).orderBy(works.createdAt);

  return new Response(JSON.stringify(all), {
    headers: { "Content-Type": "application/json" },
  });
};
