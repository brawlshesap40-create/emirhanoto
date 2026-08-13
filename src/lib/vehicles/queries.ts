import { and, asc, desc, eq, gte, ilike, lte, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { vehicles } from "@/lib/db/schema";
import type { VehicleCategory } from "./constants";

export type VehicleFilters = {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  maxMileage?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  category?: VehicleCategory;
};

function buildWhere(filters: VehicleFilters) {
  const conditions = [ne(vehicles.status, "satildi")];

  if (filters.brand) conditions.push(eq(vehicles.brand, filters.brand));
  if (filters.model) conditions.push(ilike(vehicles.model, `%${filters.model}%`));
  if (filters.minPrice !== undefined)
    conditions.push(gte(vehicles.price, filters.minPrice));
  if (filters.maxPrice !== undefined)
    conditions.push(lte(vehicles.price, filters.maxPrice));
  if (filters.year !== undefined) conditions.push(eq(vehicles.year, filters.year));
  if (filters.maxMileage !== undefined)
    conditions.push(lte(vehicles.mileage, filters.maxMileage));
  if (filters.fuelType) conditions.push(eq(vehicles.fuelType, filters.fuelType));
  if (filters.transmission)
    conditions.push(eq(vehicles.transmission, filters.transmission));
  if (filters.bodyType) conditions.push(eq(vehicles.bodyType, filters.bodyType));
  if (filters.category) conditions.push(eq(vehicles.category, filters.category));

  return and(...conditions);
}

export async function getVehicles(filters: VehicleFilters = {}) {
  return db.query.vehicles.findMany({
    where: buildWhere(filters),
    orderBy: [desc(vehicles.createdAt)],
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
    },
  });
}

export async function getFeaturedVehicles(limit = 6) {
  return db.query.vehicles.findMany({
    where: and(ne(vehicles.status, "satildi"), eq(vehicles.isFeatured, true)),
    orderBy: [desc(vehicles.createdAt)],
    limit,
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
    },
  });
}

export async function getVehicleBySlug(slug: string) {
  return db.query.vehicles.findFirst({
    where: eq(vehicles.slug, slug),
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
      features: { orderBy: (features, { asc }) => [asc(features.id)] },
    },
  });
}

export async function getDistinctBrands() {
  const rows = await db
    .selectDistinct({ brand: vehicles.brand })
    .from(vehicles)
    .where(ne(vehicles.status, "satildi"))
    .orderBy(asc(vehicles.brand));
  return rows.map((row) => row.brand);
}

export async function getPriceRange() {
  const [row] = await db
    .select({
      min: sql<number>`min(${vehicles.price})`,
      max: sql<number>`max(${vehicles.price})`,
    })
    .from(vehicles)
    .where(ne(vehicles.status, "satildi"));
  return { min: row?.min ?? 0, max: row?.max ?? 0 };
}
