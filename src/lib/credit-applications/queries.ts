import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { creditApplications } from "@/lib/db/schema";

export async function getAllCreditApplications() {
  return db.query.creditApplications.findMany({
    orderBy: [desc(creditApplications.createdAt)],
    with: { vehicle: true },
  });
}

export async function countNewCreditApplications() {
  const rows = await db.query.creditApplications.findMany({
    where: eq(creditApplications.status, "yeni"),
    columns: { id: true },
  });
  return rows.length;
}
