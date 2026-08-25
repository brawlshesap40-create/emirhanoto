"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { rentalRequests } from "@/lib/db/schema";
import { verifySession } from "@/lib/auth/dal";
import {
  rentalRequestSchema,
  rentalRequestResponseSchema,
  type RentalRequestResponseInput,
} from "@/lib/validation/rental-request";

export type RentalRequestFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function submitRentalRequestAction(
  _prevState: RentalRequestFormState,
  formData: FormData
): Promise<RentalRequestFormState> {
  const rawVehicleId = Number(formData.get("rentalVehicleId"));

  const parsed = rentalRequestSchema.safeParse({
    rentalVehicleId: rawVehicleId,
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    note: String(formData.get("note") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Lütfen formu kontrol edin.",
    };
  }

  const data = parsed.data;

  await db.insert(rentalRequests).values({
    rentalVehicleId: data.rentalVehicleId,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || null,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    note: data.note || null,
  });

  revalidatePath("/admin/kiralama-talepleri");
  return { status: "success" };
}

export async function updateRentalRequestAction(
  id: number,
  input: RentalRequestResponseInput
) {
  await verifySession();
  const data = rentalRequestResponseSchema.parse(input);

  await db
    .update(rentalRequests)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(rentalRequests.id, id));

  revalidatePath("/admin/kiralama-talepleri");
}
