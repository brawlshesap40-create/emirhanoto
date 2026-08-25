import { describe, expect, it } from "vitest";
import { rentalVehicleInputSchema } from "./rental-vehicle";

const validInput = {
  brand: "Renault",
  model: "Clio",
  year: 2023,
  category: "otomobil",
  transmission: "Otomatik",
  fuelType: "Benzin",
  seatCount: 5,
  doorCount: 4,
  color: "Gri",
  dailyPrice: 2500,
  weeklyPrice: 15000,
  monthlyPrice: null,
  deposit: 5000,
  minRentalDays: 1,
  description: null,
  status: "musait",
  isFeatured: false,
  features: ["Klima"],
  images: [{ url: "https://example.com/1.jpg", altText: null, category: null }],
} as const;

describe("rentalVehicleInputSchema", () => {
  it("accepts a fully valid rental vehicle", () => {
    expect(rentalVehicleInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects a rental vehicle with no photos", () => {
    const result = rentalVehicleInputSchema.safeParse({ ...validInput, images: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a negative daily price", () => {
    const result = rentalVehicleInputSchema.safeParse({ ...validInput, dailyPrice: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects a minRentalDays below 1", () => {
    const result = rentalVehicleInputSchema.safeParse({ ...validInput, minRentalDays: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown status", () => {
    const result = rentalVehicleInputSchema.safeParse({ ...validInput, status: "iade" });
    expect(result.success).toBe(false);
  });
});
