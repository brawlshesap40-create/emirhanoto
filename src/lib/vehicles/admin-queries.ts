import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { vehicles } from "@/lib/db/schema";

export async function getAllVehiclesAdmin() {
  return db.query.vehicles.findMany({
    orderBy: [desc(vehicles.createdAt)],
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
}

export async function getVehicleForEdit(id: number) {
  return db.query.vehicles.findFirst({
    where: eq(vehicles.id, id),
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
      features: { orderBy: (features, { asc }) => [asc(features.id)] },
    },
  });
}
