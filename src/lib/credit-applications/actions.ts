"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { creditApplications } from "@/lib/db/schema";
import { verifySession } from "@/lib/auth/dal";
import {
  creditApplicationSchema,
  creditApplicationResponseSchema,
  type CreditApplicationResponseInput,
} from "@/lib/validation/credit-application";

export type CreditApplicationFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function submitCreditApplicationAction(
  _prevState: CreditApplicationFormState,
  formData: FormData
): Promise<CreditApplicationFormState> {
  const rawVehicleId = Number(formData.get("vehicleId"));

  const parsed = creditApplicationSchema.safeParse({
    vehicleId: Number.isFinite(rawVehicleId) && rawVehicleId > 0 ? rawVehicleId : undefined,
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    note: String(formData.get("note") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Lütfen formu kontrol edin.",
    };
  }

  const data = parsed.data;

  await db.insert(creditApplications).values({
    vehicleId: data.vehicleId ?? null,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || null,
    note: data.note || null,
  });

  revalidatePath("/admin/credit-applications");
  return { status: "success" };
}

export async function updateCreditApplicationAction(
  id: number,
  input: CreditApplicationResponseInput
) {
  await verifySession();
  const data = creditApplicationResponseSchema.parse(input);

  await db
    .update(creditApplications)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(creditApplications.id, id));

  revalidatePath("/admin/credit-applications");
}
