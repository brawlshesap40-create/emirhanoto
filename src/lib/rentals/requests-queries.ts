import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { rentalRequests } from "@/lib/db/schema";

export async function getAllRentalRequests() {
  return db.query.rentalRequests.findMany({
    orderBy: [desc(rentalRequests.createdAt)],
    with: { rentalVehicle: true },
    limit: 500,
  });
}

export async function countNewRentalRequests() {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(rentalRequests)
    .where(eq(rentalRequests.status, "yeni"));
  return Number(row?.total ?? 0);
}
