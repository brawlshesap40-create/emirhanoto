import { z } from "zod";

export const testDriveRequestSchema = z.object({
  vehicleId: z.number().int().positive(),
  fullName: z.string().trim().min(2, "Ad soyad zorunludur").max(150),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası girin").max(30),
  email: z
    .string()
    .trim()
    .max(255)
    .email("Geçerli bir e-posta girin")
    .optional()
    .or(z.literal("")),
  preferredDate: z.string().trim().max(20).optional().or(z.literal("")),
  preferredTimeSlot: z.string().trim().max(50).optional().or(z.literal("")),
  viaVideoCall: z.boolean().optional(),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type TestDriveRequestInput = z.infer<typeof testDriveRequestSchema>;

export const testDriveResponseSchema = z.object({
  status: z.enum(["yeni", "onaylandi", "tamamlandi", "iptal"]),
  adminNote: z.string().trim().nullable(),
});

export type TestDriveResponseInput = z.infer<typeof testDriveResponseSchema>;
