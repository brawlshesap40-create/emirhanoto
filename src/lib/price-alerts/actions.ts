"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { priceAlertRequests } from "@/lib/db/schema";
import { verifySession } from "@/lib/auth/dal";
import { priceAlertRequestSchema } from "@/lib/validation/price-alert";

export type PriceAlertFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function submitPriceAlertRequestAction(
  _prevState: PriceAlertFormState,
  formData: FormData
): Promise<PriceAlertFormState> {
  const rawVehicleId = Number(formData.get("vehicleId"));

  const parsed = priceAlertRequestSchema.safeParse({
    vehicleId: Number.isFinite(rawVehicleId) ? rawVehicleId : undefined,
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Lütfen formu kontrol edin.",
    };
  }

  const data = parsed.data;

  await db.insert(priceAlertRequests).values({
    vehicleId: data.vehicleId,
    fullName: data.fullName,
    phone: data.phone || null,
    email: data.email || null,
  });

  revalidatePath("/admin/price-alerts");
  return { status: "success" };
}

export async function markPriceAlertNotifiedAction(id: number) {
  await verifySession();
  await db
    .update(priceAlertRequests)
    .set({ notified: true })
    .where(eq(priceAlertRequests.id, id));

  revalidatePath("/admin/price-alerts");
}
