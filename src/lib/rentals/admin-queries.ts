import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { rentalVehicles } from "@/lib/db/schema";

const ADMIN_LIST_LIMIT = 500;

export async function getAllRentalVehiclesAdmin() {
  return db.query.rentalVehicles.findMany({
    orderBy: [desc(rentalVehicles.createdAt)],
    limit: ADMIN_LIST_LIMIT,
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
}

export async function getRentalVehicleCount() {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(rentalVehicles);
  return Number(row?.total ?? 0);
}

export async function getRentalVehicleForEdit(id: number) {
  return db.query.rentalVehicles.findFirst({
    where: eq(rentalVehicles.id, id),
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
      features: { orderBy: (features, { asc }) => [asc(features.id)] },
    },
  });
}
