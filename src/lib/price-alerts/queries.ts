import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { priceAlertRequests } from "@/lib/db/schema";

export async function getAllPriceAlertRequests() {
  return db.query.priceAlertRequests.findMany({
    orderBy: [desc(priceAlertRequests.createdAt)],
    with: { vehicle: true },
  });
}

export async function countPendingPriceAlerts() {
  const rows = await db.query.priceAlertRequests.findMany({
    where: eq(priceAlertRequests.notified, false),
    columns: { id: true },
  });
  return rows.length;
}
