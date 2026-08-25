import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { priceAlertRequests } from "@/lib/db/schema";

export async function getAllPriceAlertRequests() {
  return db.query.priceAlertRequests.findMany({
    orderBy: [desc(priceAlertRequests.createdAt)],
    with: { vehicle: true },
    limit: 500,
  });
}

export async function countPendingPriceAlerts() {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(priceAlertRequests)
    .where(eq(priceAlertRequests.notified, false));
  return Number(row?.total ?? 0);
}
