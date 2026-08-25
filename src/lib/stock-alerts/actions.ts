"use server";

import { db } from "@/lib/db";
import { stockAlertSubscriptions } from "@/lib/db/schema";
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
