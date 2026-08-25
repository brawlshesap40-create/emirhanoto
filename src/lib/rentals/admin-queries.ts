import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rentalVehicles } from "@/lib/db/schema";

export async function getAllRentalVehiclesAdmin() {
  return db.query.rentalVehicles.findMany({
    orderBy: [desc(rentalVehicles.createdAt)],
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
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
