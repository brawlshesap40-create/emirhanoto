import { and, asc, desc, eq, gte, ilike, inArray, lte, ne, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
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

// Bu dosya ham Drizzle sorguları kullandığı için Next'in fetch()-tabanlı
// önbelleği bunlara uygulanmaz; unstable_cache ile açık bir ISR katmanı
// kuruyoruz. Yazma işlemleri (vehicles/actions.ts) revalidateTag("vehicles")
// çağırarak bu önbelleği anında geçersiz kılar — 5 dakikalık revalidate
// süresi sadece bir üst sınır.
const CACHE_OPTIONS = { revalidate: 300, tags: ["vehicles"] };

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

export const getVehicles = unstable_cache(
  async (filters: VehicleFilters = {}) => {
    return db.query.vehicles.findMany({
      where: buildWhere(filters),
      orderBy: [desc(vehicles.createdAt)],
      with: {
        images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
      },
    });
  },
  ["vehicles-list"],
  CACHE_OPTIONS
);

export const getFeaturedVehicles = unstable_cache(
  async (limit = 6) => {
    return db.query.vehicles.findMany({
      where: and(ne(vehicles.status, "satildi"), eq(vehicles.isFeatured, true)),
      orderBy: [desc(vehicles.createdAt)],
      limit,
      with: {
        images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
      },
    });
  },
  ["vehicles-featured"],
  CACHE_OPTIONS
);

export const getVehicleBySlug = unstable_cache(
  async (slug: string) => {
    return db.query.vehicles.findFirst({
      where: eq(vehicles.slug, slug),
      with: {
        images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
        features: { orderBy: (features, { asc }) => [asc(features.id)] },
      },
    });
  },
  ["vehicle-by-slug"],
  CACHE_OPTIONS
);

export const getSimilarVehicles = unstable_cache(
  async (vehicle: { id: number; category: VehicleCategory; brand: string }) => {
    return db.query.vehicles.findMany({
      where: and(
        ne(vehicles.status, "satildi"),
        ne(vehicles.id, vehicle.id),
        sql`(${vehicles.category} = ${vehicle.category} or ${vehicles.brand} = ${vehicle.brand})`
      ),
      orderBy: [desc(vehicles.createdAt)],
      limit: 4,
      with: {
        images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
      },
    });
  },
  ["vehicles-similar"],
  CACHE_OPTIONS
);

export async function getVehiclesByIds(ids: number[]) {
  if (ids.length === 0) return [];
  return db.query.vehicles.findMany({
    where: inArray(vehicles.id, ids),
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)], limit: 1 },
    },
  });
}

export async function incrementVehicleView(id: number) {
  await db
    .update(vehicles)
    .set({ viewCount: sql`${vehicles.viewCount} + 1` })
    .where(eq(vehicles.id, id));
}

export const getDistinctBrands = unstable_cache(
  async () => {
    const rows = await db
      .selectDistinct({ brand: vehicles.brand })
      .from(vehicles)
      .where(ne(vehicles.status, "satildi"))
      .orderBy(asc(vehicles.brand));
    return rows.map((row) => row.brand);
  },
  ["vehicles-distinct-brands"],
  CACHE_OPTIONS
);

export const getPriceRange = unstable_cache(
  async () => {
    const [row] = await db
      .select({
        min: sql<number>`min(${vehicles.price})`,
        max: sql<number>`max(${vehicles.price})`,
      })
      .from(vehicles)
      .where(ne(vehicles.status, "satildi"));
    return { min: row?.min ?? 0, max: row?.max ?? 0 };
  },
  ["vehicles-price-range"],
  CACHE_OPTIONS
);
