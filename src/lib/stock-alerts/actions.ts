"use server";

import { db } from "@/lib/db";
import { stockAlertSubscriptions } from "@/lib/db/schema";
import { checkRateLimit, getClientIp, RateLimitError } from "@/lib/rate-limit";
import { stockAlertSubscriptionSchema } from "@/lib/validation/stock-alert";
import type { VehicleCategory } from "@/lib/vehicles/constants";

export type StockAlertFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function submitStockAlertSubscriptionAction(
  _prevState: StockAlertFormState,
  formData: FormData
): Promise<StockAlertFormState> {
  try {
    await checkRateLimit(`form:stock-alert:${await getClientIp()}`, {
      limit: 5,
      windowSeconds: 600,
    });
  } catch (error) {
    if (error instanceof RateLimitError) return { status: "error", message: error.message };
    throw error;
  }

  const parsed = stockAlertSubscriptionSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    category: String(formData.get("category") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Lütfen formu kontrol edin.",
    };
  }

  const data = parsed.data;

  await db.insert(stockAlertSubscriptions).values({
    email: data.email,
    brand: data.brand || null,
    category: (data.category as VehicleCategory) || null,
  });

  return { status: "success" };
}
