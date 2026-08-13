import { z } from "zod";

export const valuationRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Ad soyad zorunludur"),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası girin"),
  email: z.string().trim().email("Geçerli bir e-posta girin").optional().or(z.literal("")),
  brand: z.string().trim().min(1, "Marka zorunludur"),
  model: z.string().trim().min(1, "Model zorunludur"),
  year: z.number().int().min(1980).max(2100),
  mileage: z.number().int().min(0),
  description: z.string().trim().optional().or(z.literal("")),
});

export type ValuationRequestInput = z.infer<typeof valuationRequestSchema>;

export const valuationResponseSchema = z.object({
  status: z.enum(["yeni", "gorusuluyor", "sonuclandi"]),
  offeredPrice: z.number().int().min(0).nullable(),
  adminNote: z.string().trim().nullable(),
});

export type ValuationResponseInput = z.infer<typeof valuationResponseSchema>;
