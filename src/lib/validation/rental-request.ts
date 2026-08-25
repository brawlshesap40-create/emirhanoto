import { z } from "zod";

export const rentalRequestSchema = z.object({
  rentalVehicleId: z.number().int().positive(),
  fullName: z.string().trim().min(2, "Ad soyad zorunludur"),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası girin"),
  email: z.string().trim().email("Geçerli bir e-posta girin").optional().or(z.literal("")),
  startDate: z.string().trim().optional().or(z.literal("")),
  endDate: z.string().trim().optional().or(z.literal("")),
  note: z.string().trim().optional().or(z.literal("")),
});

export type RentalRequestInput = z.infer<typeof rentalRequestSchema>;

export const rentalRequestResponseSchema = z.object({
  status: z.enum(["yeni", "gorusuluyor", "sonuclandi"]),
  adminNote: z.string().trim().nullable(),
});

export type RentalRequestResponseInput = z.infer<typeof rentalRequestResponseSchema>;
