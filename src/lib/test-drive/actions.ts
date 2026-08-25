"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { testDriveRequests } from "@/lib/db/schema";
import { verifySession } from "@/lib/auth/dal";
import { checkRateLimit, getClientIp, RateLimitError } from "@/lib/rate-limit";
import {
  testDriveRequestSchema,
  testDriveResponseSchema,
  type TestDriveResponseInput,
} from "@/lib/validation/test-drive";

export type TestDriveFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function submitTestDriveRequestAction(
  _prevState: TestDriveFormState,
  formData: FormData
): Promise<TestDriveFormState> {
  try {
    await checkRateLimit(`form:test-drive:${await getClientIp()}`, {
      limit: 5,
      windowSeconds: 600,
    });
  } catch (error) {
    if (error instanceof RateLimitError) return { status: "error", message: error.message };
    throw error;
  }

  const rawVehicleId = Number(formData.get("vehicleId"));

  const parsed = testDriveRequestSchema.safeParse({
    vehicleId: Number.isFinite(rawVehicleId) ? rawVehicleId : undefined,
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    preferredDate: String(formData.get("preferredDate") ?? ""),
    preferredTimeSlot: String(formData.get("preferredTimeSlot") ?? ""),
    viaVideoCall: formData.get("viaVideoCall") === "on",
    note: String(formData.get("note") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Lütfen formu kontrol edin.",
    };
  }

  const data = parsed.data;

  await db.insert(testDriveRequests).values({
    vehicleId: data.vehicleId,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || null,
    preferredDate: data.preferredDate || null,
    preferredTimeSlot: data.preferredTimeSlot || null,
    viaVideoCall: data.viaVideoCall ?? false,
    note: data.note || null,
  });

  revalidatePath("/admin/test-drive-requests");
  return { status: "success" };
}

export async function updateTestDriveRequestAction(
  id: number,
  input: TestDriveResponseInput
) {
  await verifySession();
  const data = testDriveResponseSchema.parse(input);

  await db
    .update(testDriveRequests)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(testDriveRequests.id, id));

  revalidatePath("/admin/test-drive-requests");
  revalidatePath(`/admin/test-drive-requests/${id}`);
}
