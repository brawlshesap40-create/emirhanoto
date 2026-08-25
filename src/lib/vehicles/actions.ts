"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { vehicleFeatures, vehicleImages, vehicles } from "@/lib/db/schema";
import { verifySession } from "@/lib/auth/dal";
import { vehicleInputSchema, type VehicleInput } from "@/lib/validation/vehicle";
import { generateVehicleSlug } from "./slug";
import { getVehiclesByIds } from "./queries";

function revalidatePublicPaths(slug?: string) {
  // revalidatePath temizler sayfa render önbelleğini; updateTag ise
  // queries.ts'teki unstable_cache ile sarılmış veri katmanını temizler.
  // updateTag (Server Action içinden) bir sonraki isteğin bayat veri
  // görmemesini garantiler — ör. "satıldı" işaretlenen bir araç anında
  // öyle görünür.
  updateTag("vehicles");
  revalidatePath("/");
  revalidatePath("/araclarimiz");
  if (slug) revalidatePath(`/araclarimiz/${slug}`);
}

export async function createVehicleAction(input: VehicleInput) {
  await verifySession();
  const data = vehicleInputSchema.parse(input);
  const slug = await generateVehicleSlug(data.brand, data.model, data.year);

  const [vehicle] = await db
    .insert(vehicles)
    .values({ ...data, slug })
    .returning({ id: vehicles.id });

  if (data.images.length > 0) {
    await db.insert(vehicleImages).values(
      data.images.map((image, index) => ({
        vehicleId: vehicle.id,
        url: image.url,
        altText: image.altText,
        category: image.category ?? null,
        sortOrder: index,
      }))
    );
  }

  if (data.features.length > 0) {
    await db.insert(vehicleFeatures).values(
      data.features.map((label) => ({ vehicleId: vehicle.id, label }))
    );
  }

  revalidatePublicPaths(slug);
  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}

export async function updateVehicleAction(id: number, input: VehicleInput) {
  await verifySession();
  const data = vehicleInputSchema.parse(input);
  const slug = await generateVehicleSlug(data.brand, data.model, data.year, id);

  await db
    .update(vehicles)
    .set({ ...data, slug, updatedAt: new Date() })
    .where(eq(vehicles.id, id));

  await db.delete(vehicleImages).where(eq(vehicleImages.vehicleId, id));
  if (data.images.length > 0) {
    await db.insert(vehicleImages).values(
      data.images.map((image, index) => ({
        vehicleId: id,
        url: image.url,
        altText: image.altText,
        category: image.category ?? null,
        sortOrder: index,
      }))
    );
  }

  await db.delete(vehicleFeatures).where(eq(vehicleFeatures.vehicleId, id));
  if (data.features.length > 0) {
    await db.insert(vehicleFeatures).values(
      data.features.map((label) => ({ vehicleId: id, label }))
    );
  }

  revalidatePublicPaths(slug);
  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}

export async function deleteVehicleAction(id: number) {
  await verifySession();
  await db.delete(vehicles).where(eq(vehicles.id, id));
  revalidatePublicPaths();
  revalidatePath("/admin/vehicles");
}

export async function setVehicleStatusAction(
  id: number,
  status: "satista" | "rezerve" | "satildi"
) {
  await verifySession();
  await db
    .update(vehicles)
    .set({ status, updatedAt: new Date() })
    .where(eq(vehicles.id, id));
  revalidatePublicPaths();
  revalidatePath("/admin/vehicles");
}

export async function fetchVehiclesByIds(ids: number[]) {
  return getVehiclesByIds(ids);
}
