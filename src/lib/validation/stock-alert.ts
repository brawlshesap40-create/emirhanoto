import { z } from "zod";

export const stockAlertSubscriptionSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  brand: z.string().trim().optional().or(z.literal("")),
  category: z
    .enum(["cift_kabin_pickup", "ticari", "suv", "otomobil", "arazi", "premium"])
    .optional()
    .or(z.literal("")),
});

export type StockAlertSubscriptionInput = z.infer<typeof stockAlertSubscriptionSchema>;
