import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { valuationRequests } from "@/lib/db/schema";

export async function getAllValuationRequests() {
  return db.query.valuationRequests.findMany({
    orderBy: [desc(valuationRequests.createdAt)],
    limit: 500,
  });
}

export async function getValuationRequestById(id: number) {
  return db.query.valuationRequests.findFirst({
    where: eq(valuationRequests.id, id),
  });
}

export async function countNewValuationRequests() {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(valuationRequests)
    .where(eq(valuationRequests.status, "yeni"));
  return Number(row?.total ?? 0);
}
