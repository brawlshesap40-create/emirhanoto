import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { testDriveRequests } from "@/lib/db/schema";

export async function getAllTestDriveRequests() {
  return db.query.testDriveRequests.findMany({
    orderBy: [desc(testDriveRequests.createdAt)],
    with: { vehicle: true },
    limit: 500,
  });
}

export async function getTestDriveRequestById(id: number) {
  return db.query.testDriveRequests.findFirst({
    where: eq(testDriveRequests.id, id),
    with: { vehicle: true },
  });
}

export async function countNewTestDriveRequests() {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(testDriveRequests)
    .where(eq(testDriveRequests.status, "yeni"));
  return Number(row?.total ?? 0);
}
