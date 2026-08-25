import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { creditApplications } from "@/lib/db/schema";

export async function getAllCreditApplications() {
  return db.query.creditApplications.findMany({
    orderBy: [desc(creditApplications.createdAt)],
    with: { vehicle: true },
    limit: 500,
  });
}

export async function countNewCreditApplications() {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(creditApplications)
    .where(eq(creditApplications.status, "yeni"));
  return Number(row?.total ?? 0);
}
