import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { vehicles } from "@/lib/db/schema";

// Not: bu proje boyutunda (tek şube, düzinelerce araç) 500'lük bir sınır
// pratikte hiç dolmaz; bu, gerçek sayfalama eklenene kadar tam tablo
// büyümesine karşı bir güvenlik ağı.
const ADMIN_LIST_LIMIT = 500;

export async function getAllVehiclesAdmin() {
  return db.query.vehicles.findMany({
    orderBy: [desc(vehicles.createdAt)],
    limit: ADMIN_LIST_LIMIT,
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
}

export async function getVehicleStats() {
  const [row] = await db
    .select({
      total: sql<number>`count(*)`,
      active: sql<number>`count(*) filter (where ${vehicles.status} = 'satista')`,
    })
    .from(vehicles);
  return { total: Number(row?.total ?? 0), active: Number(row?.active ?? 0) };
}

export async function getRecentVehiclesAdmin(limit = 5) {
  return db.query.vehicles.findMany({
    orderBy: [desc(vehicles.createdAt)],
    limit,
    columns: {
      id: true,
      brand: true,
      model: true,
      year: true,
      price: true,
      status: true,
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
