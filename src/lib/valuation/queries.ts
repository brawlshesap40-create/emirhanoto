import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { valuationRequests } from "@/lib/db/schema";

export async function getAllValuationRequests() {
  return db.query.valuationRequests.findMany({
    orderBy: [desc(valuationRequests.createdAt)],
  });
}

export async function getValuationRequestById(id: number) {
  return db.query.valuationRequests.findFirst({
    where: eq(valuationRequests.id, id),
  });
}

export async function countNewValuationRequests() {
  const rows = await db.query.valuationRequests.findMany({
    where: eq(valuationRequests.status, "yeni"),
    columns: { id: true },
  });
  return rows.length;
}
