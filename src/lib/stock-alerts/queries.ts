import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { stockAlertSubscriptions } from "@/lib/db/schema";

export async function getAllStockAlertSubscriptions() {
  return db.query.stockAlertSubscriptions.findMany({
    orderBy: [desc(stockAlertSubscriptions.createdAt)],
  });
}
