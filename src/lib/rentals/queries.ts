import { and, asc, desc, eq, gte, ilike, inArray, lte, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { rentalVehicles } from "@/lib/db/schema";
import type { RentalVehicleCategory } from "./constants";

export type RentalVehicleFilters = {
  brand?: string;
  model?: string;
  minDailyPrice?: number;
  maxDailyPrice?: number;
  transmission?: string;
  fuelType?: string;
  category?: RentalVehicleCategory;
};

function buildWhere(filters: RentalVehicleFilters) {
  const conditions = [ne(rentalVehicles.status, "bakimda")];

  if (filters.brand) conditions.push(eq(rentalVehicles.brand, filters.brand));
  if (filters.model) conditions.push(ilike(rentalVehicles.model, `%${filters.model}%`));
  if (filters.minDailyPrice !== undefined)
    conditions.push(gte(rentalVehicles.dailyPrice, filters.minDailyPrice));
  if (filters.maxDailyPrice !== undefined)
    conditions.push(lte(rentalVehicles.dailyPrice, filters.maxDailyPrice));
  if (filters.transmission)
    conditions.push(eq(rentalVehicles.transmission, filters.transmission));
  if (filters.fuelType) conditions.push(eq(rentalVehicles.fuelType, filters.fuelType));
  if (filters.category) conditions.push(eq(rentalVehicles.category, filters.category));

  return and(...conditions);
}

export async function getRentalVehicles(filters: RentalVehicleFilters = {}) {
  return db.query.rentalVehicles.findMany({
    where: buildWhere(filters),
    orderBy: [desc(rentalVehicles.createdAt)],
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
    },
  });
}

export async function getFeaturedRentalVehicles(limit = 6) {
  return db.query.rentalVehicles.findMany({
    where: and(ne(rentalVehicles.status, "bakimda"), eq(rentalVehicles.isFeatured, true)),
    orderBy: [desc(rentalVehicles.createdAt)],
    limit,
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
    },
  });
}

export async function getRentalVehicleBySlug(slug: string) {
  return db.query.rentalVehicles.findFirst({
    where: eq(rentalVehicles.slug, slug),
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
      features: { orderBy: (features, { asc }) => [asc(features.id)] },
    },
  });
}

export async function getSimilarRentalVehicles(vehicle: {
  id: number;
  category: RentalVehicleCategory;
  brand: string;
}) {
  return db.query.rentalVehicles.findMany({
    where: and(
      ne(rentalVehicles.status, "bakimda"),
      ne(rentalVehicles.id, vehicle.id),
      sql`(${rentalVehicles.category} = ${vehicle.category} or ${rentalVehicles.brand} = ${vehicle.brand})`
    ),
    orderBy: [desc(rentalVehicles.createdAt)],
    limit: 4,
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
    },
  });
}

export async function getRentalVehiclesByIds(ids: number[]) {
  if (ids.length === 0) return [];
  return db.query.rentalVehicles.findMany({
    where: inArray(rentalVehicles.id, ids),
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
    },
  });
}

export async function getDistinctRentalBrands() {
  const rows = await db
    .selectDistinct({ brand: rentalVehicles.brand })
    .from(rentalVehicles)
    .where(ne(rentalVehicles.status, "bakimda"))
    .orderBy(asc(rentalVehicles.brand));
  return rows.map((row) => row.brand);
}

export async function getRentalDailyPriceRange() {
  const [row] = await db
    .select({
      min: sql<number>`min(${rentalVehicles.dailyPrice})`,
      max: sql<number>`max(${rentalVehicles.dailyPrice})`,
    })
    .from(rentalVehicles)
    .where(ne(rentalVehicles.status, "bakimda"));
  return { min: row?.min ?? 0, max: row?.max ?? 0 };
}
