import { z } from "zod";

export const priceAlertRequestSchema = z.object({
  vehicleId: z.number().int().positive(),
  fullName: z.string().trim().min(2, "Ad soyad zorunludur").max(150),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .max(255)
    .email("Geçerli bir e-posta girin")
    .optional()
    .or(z.literal("")),
});

export type PriceAlertRequestInput = z.infer<typeof priceAlertRequestSchema>;
