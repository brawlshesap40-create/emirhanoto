"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { rentalVehicleFeatures, rentalVehicleImages, rentalVehicles } from "@/lib/db/schema";
import { verifySession } from "@/lib/auth/dal";
import {
  rentalVehicleInputSchema,
  type RentalVehicleInput,
} from "@/lib/validation/rental-vehicle";
import { generateRentalVehicleSlug } from "./slug";
import { getRentalVehiclesByIds } from "./queries";

function revalidatePublicPaths(slug?: string) {
  updateTag("rentals");
  revalidatePath("/");
  revalidatePath("/kiralama");
  if (slug) revalidatePath(`/kiralama/${slug}`);
}

export async function createRentalVehicleAction(input: RentalVehicleInput) {
  await verifySession();
  const data = rentalVehicleInputSchema.parse(input);
  const slug = await generateRentalVehicleSlug(data.brand, data.model, data.year);

  const [vehicle] = await db
    .insert(rentalVehicles)
    .values({ ...data, slug })
    .returning({ id: rentalVehicles.id });

  if (data.images.length > 0) {
    await db.insert(rentalVehicleImages).values(
      data.images.map((image, index) => ({
        rentalVehicleId: vehicle.id,
        url: image.url,
        altText: image.altText,
        category: image.category ?? null,
        sortOrder: index,
      }))
    );
  }

  if (data.features.length > 0) {
    await db.insert(rentalVehicleFeatures).values(
      data.features.map((label) => ({ rentalVehicleId: vehicle.id, label }))
    );
  }

  revalidatePublicPaths(slug);
  revalidatePath("/admin/kiralama");
  redirect("/admin/kiralama");
}

export async function updateRentalVehicleAction(id: number, input: RentalVehicleInput) {
  await verifySession();
  const data = rentalVehicleInputSchema.parse(input);
  const slug = await generateRentalVehicleSlug(data.brand, data.model, data.year, id);

  await db
    .update(rentalVehicles)
    .set({ ...data, slug, updatedAt: new Date() })
    .where(eq(rentalVehicles.id, id));

  await db.delete(rentalVehicleImages).where(eq(rentalVehicleImages.rentalVehicleId, id));
  if (data.images.length > 0) {
    await db.insert(rentalVehicleImages).values(
      data.images.map((image, index) => ({
        rentalVehicleId: id,
        url: image.url,
        altText: image.altText,
        category: image.category ?? null,
        sortOrder: index,
      }))
    );
  }

  await db.delete(rentalVehicleFeatures).where(eq(rentalVehicleFeatures.rentalVehicleId, id));
  if (data.features.length > 0) {
    await db.insert(rentalVehicleFeatures).values(
      data.features.map((label) => ({ rentalVehicleId: id, label }))
    );
  }

  revalidatePublicPaths(slug);
  revalidatePath("/admin/kiralama");
  redirect("/admin/kiralama");
}

export async function deleteRentalVehicleAction(id: number) {
  await verifySession();
  await db.delete(rentalVehicles).where(eq(rentalVehicles.id, id));
  revalidatePublicPaths();
  revalidatePath("/admin/kiralama");
}

export async function setRentalVehicleStatusAction(
  id: number,
  status: "musait" | "kirada" | "bakimda"
) {
  await verifySession();
  await db
    .update(rentalVehicles)
    .set({ status, updatedAt: new Date() })
    .where(eq(rentalVehicles.id, id));
  revalidatePublicPaths();
  revalidatePath("/admin/kiralama");
}

export async function fetchRentalVehiclesByIds(ids: number[]) {
  return getRentalVehiclesByIds(ids);
}
