import { z } from "zod";

export const rentalVehicleInputSchema = z.object({
  brand: z.string().trim().min(1, "Marka zorunludur"),
  model: z.string().trim().min(1, "Model zorunludur"),
  year: z.number().int().min(1980).max(2100),
  category: z.enum([
    "cift_kabin_pickup",
    "ticari",
    "suv",
    "otomobil",
    "arazi",
    "premium",
  ]),
  transmission: z.string().trim().nullable(),
  fuelType: z.string().trim().nullable(),
  seatCount: z.number().int().min(0).nullable(),
  doorCount: z.number().int().min(0).nullable(),
  color: z.string().trim().nullable(),
  dailyPrice: z.number().int().min(0),
  weeklyPrice: z.number().int().min(0).nullable(),
  monthlyPrice: z.number().int().min(0).nullable(),
  deposit: z.number().int().min(0).nullable(),
  minRentalDays: z.number().int().min(1),
  description: z.string().trim().nullable(),
  status: z.enum(["musait", "kirada", "bakimda"]),
  isFeatured: z.boolean(),
  features: z.array(z.string().trim().min(1)),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        altText: z.string().nullable(),
        category: z.string().nullable().optional(),
      })
    )
    .min(1, "En az 1 fotoğraf gereklidir"),
});

export type RentalVehicleInput = z.infer<typeof rentalVehicleInputSchema>;
