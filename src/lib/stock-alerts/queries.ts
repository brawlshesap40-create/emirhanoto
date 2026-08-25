import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { stockAlertSubscriptions } from "@/lib/db/schema";

export async function getAllStockAlertSubscriptions() {
  return db.query.stockAlertSubscriptions.findMany({
    orderBy: [desc(stockAlertSubscriptions.createdAt)],
    limit: 500,
  });
}

export async function countStockAlertSubscriptions() {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(stockAlertSubscriptions);
  return Number(row?.total ?? 0);
}
