"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { valuationRequests } from "@/lib/db/schema";
import { verifySession } from "@/lib/auth/dal";
import {
  valuationRequestSchema,
  valuationResponseSchema,
  type ValuationResponseInput,
} from "@/lib/validation/valuation";

export type ValuationFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function submitValuationRequestAction(
  _prevState: ValuationFormState,
  formData: FormData
): Promise<ValuationFormState> {
  const rawYear = Number(formData.get("year"));
  const rawMileage = Number(formData.get("mileage"));

  const parsed = valuationRequestSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    model: String(formData.get("model") ?? ""),
    year: Number.isFinite(rawYear) ? rawYear : undefined,
    mileage: Number.isFinite(rawMileage) ? rawMileage : undefined,
    description: String(formData.get("description") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Lütfen formu kontrol edin.",
    };
  }

  const data = parsed.data;

  await db.insert(valuationRequests).values({
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || null,
    brand: data.brand,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    description: data.description || null,
  });

  revalidatePath("/admin/valuation-requests");
  return { status: "success" };
}

export async function updateValuationRequestAction(
  id: number,
  input: ValuationResponseInput
) {
  await verifySession();
  const data = valuationResponseSchema.parse(input);

  await db
    .update(valuationRequests)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(valuationRequests.id, id));

  revalidatePath("/admin/valuation-requests");
  revalidatePath(`/admin/valuation-requests/${id}`);
}
