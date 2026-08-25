import { z } from "zod";

export const contactMessageSchema = z.object({
  fullName: z.string().trim().min(2, "Ad soyad zorunludur").max(150),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .max(255)
    .email("Geçerli bir e-posta girin")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(5, "Mesajınızı yazın").max(3000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const contactMessageResponseSchema = z.object({
  status: z.enum(["yeni", "gorusuluyor", "sonuclandi"]),
  adminNote: z.string().trim().nullable(),
});

export type ContactMessageResponseInput = z.infer<typeof contactMessageResponseSchema>;
