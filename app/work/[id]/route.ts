import { works } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const result = await db
    .select()
    .from(works)
    .where(eq(works.id, Number(params.id)));

  return Response.json(result[0] ?? null);
}
