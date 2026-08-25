import { describe, expect, it } from "vitest";
import { valuationRequestSchema, valuationResponseSchema } from "./valuation";

const validInput = {
  fullName: "Ayşe Kara",
  phone: "0555 222 33 44",
  email: "ayse@example.com",
  brand: "Toyota",
  model: "Hilux",
  year: 2020,
  mileage: 65000,
  description: "Sorunsuz, tek elden.",
};

describe("valuationRequestSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(valuationRequestSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects a phone shorter than 10 characters", () => {
    const result = valuationRequestSchema.safeParse({ ...validInput, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects a year before 1980", () => {
    const result = valuationRequestSchema.safeParse({ ...validInput, year: 1975 });
    expect(result.success).toBe(false);
  });

  it("rejects a negative mileage", () => {
    const result = valuationRequestSchema.safeParse({ ...validInput, mileage: -100 });
    expect(result.success).toBe(false);
  });

  it("rejects a missing brand", () => {
    const result = valuationRequestSchema.safeParse({ ...validInput, brand: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a description longer than the 3000 character cap", () => {
    const result = valuationRequestSchema.safeParse({
      ...validInput,
      description: "a".repeat(3001),
    });
    expect(result.success).toBe(false);
  });
});

describe("valuationResponseSchema", () => {
  it("accepts a valid admin response", () => {
    const result = valuationResponseSchema.safeParse({
      status: "gorusuluyor",
      offeredPrice: 950000,
      adminNote: "Müşteri aranacak",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown status", () => {
    const result = valuationResponseSchema.safeParse({
      status: "beklemede",
      offeredPrice: null,
      adminNote: null,
    });
    expect(result.success).toBe(false);
  });
});
