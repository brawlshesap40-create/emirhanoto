import { z } from "zod";

export const vehicleInputSchema = z.object({
  brand: z.string().trim().min(1, "Marka zorunludur"),
  model: z.string().trim().min(1, "Model zorunludur"),
  year: z.number().int().min(1980).max(2100),
  mileage: z.number().int().min(0),
  price: z.number().int().min(0),
  category: z.enum([
    "cift_kabin_pickup",
    "ticari",
    "suv",
    "otomobil",
    "arazi",
    "premium",
  ]),
  engine: z.string().trim().nullable(),
  engineDisplacement: z.string().trim().nullable(),
  enginePower: z.string().trim().nullable(),
  fuelType: z.string().trim().nullable(),
  transmission: z.string().trim().nullable(),
  drivetrain: z.string().trim().nullable(),
  bodyType: z.string().trim().nullable(),
  color: z.string().trim().nullable(),
  doorCount: z.number().int().min(0).nullable(),
  description: z.string().trim().nullable(),
  status: z.enum(["satista", "rezerve", "satildi"]),
  isFeatured: z.boolean(),
  engineCondition: z.string().trim().nullable(),
  transmissionCondition: z.string().trim().nullable(),
  bodyCondition: z.string().trim().nullable(),
  paintCondition: z.string().trim().nullable(),
  changedParts: z.string().trim().nullable(),
  damageStatus: z.enum(["yok", "var"]),
  damageInfo: z.string().trim().nullable(),
  expertiseReportUrl: z.string().trim().nullable(),
  features: z.array(z.string().trim().min(1)),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        altText: z.string().nullable(),
      })
    )
    .min(1, "En az 1 fotoğraf gereklidir"),
});

export type VehicleInput = z.infer<typeof vehicleInputSchema>;
