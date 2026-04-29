import { works } from "@/drizzle/schema";
import { db } from "@/drizzle/db";

export async function GET() {
  const result = await db.select().from(works).orderBy(works.createdAt);
  return Response.json(result);
}
