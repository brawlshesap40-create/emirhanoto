"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { listingIssueReports } from "@/lib/db/schema";
import { verifySession } from "@/lib/auth/dal";
import { checkRateLimit, getClientIp, RateLimitError } from "@/lib/rate-limit";
import { listingIssueReportSchema } from "@/lib/validation/listing-issue";

export type ListingIssueFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function submitListingIssueReportAction(
  _prevState: ListingIssueFormState,
  formData: FormData
): Promise<ListingIssueFormState> {
  try {
    await checkRateLimit(`form:listing-issue:${await getClientIp()}`, {
      limit: 5,
      windowSeconds: 600,
    });
  } catch (error) {
    if (error instanceof RateLimitError) return { status: "error", message: error.message };
    throw error;
  }

  const rawVehicleId = Number(formData.get("vehicleId"));

  const parsed = listingIssueReportSchema.safeParse({
    vehicleId: Number.isFinite(rawVehicleId) ? rawVehicleId : undefined,
    message: String(formData.get("message") ?? ""),
    email: String(formData.get("email") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Lütfen formu kontrol edin.",
    };
  }

  const data = parsed.data;

  await db.insert(listingIssueReports).values({
    vehicleId: data.vehicleId,
    message: data.message,
    email: data.email || null,
  });

  revalidatePath("/admin/listing-issues");
  return { status: "success" };
}

export async function markListingIssueResolvedAction(id: number) {
  await verifySession();
  await db
    .update(listingIssueReports)
    .set({ resolved: true })
    .where(eq(listingIssueReports.id, id));

  revalidatePath("/admin/listing-issues");
}
