import { describe, expect, it } from "vitest";
import { vehicleInputSchema } from "./vehicle";

const validInput = {
  brand: "Toyota",
  model: "Hilux",
  year: 2022,
  mileage: 42000,
  price: 3450000,
  category: "cift_kabin_pickup",
  engine: "2.4 Dizel",
  engineDisplacement: "2393 cc",
  enginePower: "150 hp",
  fuelType: "Dizel",
  transmission: "Otomatik",
  drivetrain: "4x4",
  bodyType: "Pick-up",
  color: "Beyaz",
  doorCount: 4,
  description: null,
  status: "satista",
  isFeatured: false,
  engineCondition: null,
  transmissionCondition: null,
  bodyCondition: null,
  paintCondition: null,
  changedParts: null,
  damageStatus: "yok",
  damageInfo: null,
  expertiseReportUrl: null,
  previousPrice: null,
  videoUrl: null,
  features: ["Geri Görüş Kamerası"],
  images: [{ url: "https://example.com/1.jpg", altText: null, category: null }],
} as const;

describe("vehicleInputSchema", () => {
  it("accepts a fully valid vehicle", () => {
    expect(vehicleInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects a vehicle with no photos", () => {
    const result = vehicleInputSchema.safeParse({ ...validInput, images: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a missing brand", () => {
    const result = vehicleInputSchema.safeParse({ ...validInput, brand: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a year before 1980", () => {
    const result = vehicleInputSchema.safeParse({ ...validInput, year: 1899 });
    expect(result.success).toBe(false);
  });

  it("rejects a negative mileage", () => {
    const result = vehicleInputSchema.safeParse({ ...validInput, mileage: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown category", () => {
    const result = vehicleInputSchema.safeParse({ ...validInput, category: "kamyon" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown status", () => {
    const result = vehicleInputSchema.safeParse({ ...validInput, status: "kayip" });
    expect(result.success).toBe(false);
  });
});
