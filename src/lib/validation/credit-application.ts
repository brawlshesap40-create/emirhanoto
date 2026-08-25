import { z } from "zod";

export const creditApplicationSchema = z.object({
  vehicleId: z.number().int().positive().optional(),
  fullName: z.string().trim().min(2, "Ad soyad zorunludur"),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası girin"),
  email: z.string().trim().email("Geçerli bir e-posta girin").optional().or(z.literal("")),
  note: z.string().trim().optional().or(z.literal("")),
});

export type CreditApplicationInput = z.infer<typeof creditApplicationSchema>;

export const creditApplicationResponseSchema = z.object({
  status: z.enum(["yeni", "gorusuluyor", "sonuclandi"]),
  adminNote: z.string().trim().nullable(),
});

export type CreditApplicationResponseInput = z.infer<typeof creditApplicationResponseSchema>;
