import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { testDriveRequests } from "@/lib/db/schema";

export async function getAllTestDriveRequests() {
  return db.query.testDriveRequests.findMany({
    orderBy: [desc(testDriveRequests.createdAt)],
    with: { vehicle: true },
  });
}

export async function getTestDriveRequestById(id: number) {
  return db.query.testDriveRequests.findFirst({
    where: eq(testDriveRequests.id, id),
    with: { vehicle: true },
  });
}

export async function countNewTestDriveRequests() {
  const rows = await db.query.testDriveRequests.findMany({
    where: eq(testDriveRequests.status, "yeni"),
    columns: { id: true },
  });
  return rows.length;
}
