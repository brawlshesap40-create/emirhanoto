import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rentalRequests } from "@/lib/db/schema";

export async function getAllRentalRequests() {
  return db.query.rentalRequests.findMany({
    orderBy: [desc(rentalRequests.createdAt)],
    with: { rentalVehicle: true },
  });
}

export async function countNewRentalRequests() {
  const rows = await db.query.rentalRequests.findMany({
    where: eq(rentalRequests.status, "yeni"),
    columns: { id: true },
  });
  return rows.length;
}
