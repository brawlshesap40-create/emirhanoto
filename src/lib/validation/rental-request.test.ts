import { describe, expect, it } from "vitest";
import { rentalRequestResponseSchema, rentalRequestSchema } from "./rental-request";

const validInput = {
  rentalVehicleId: 5,
  fullName: "Zeynep Aydın",
  phone: "0555 666 77 88",
  email: "zeynep@example.com",
  startDate: "2026-09-10",
  endDate: "2026-09-15",
  note: "Havalimanından teslim istiyorum.",
};

describe("rentalRequestSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(rentalRequestSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts a submission without dates (still to be arranged)", () => {
    const result = rentalRequestSchema.safeParse({
      ...validInput,
      startDate: "",
      endDate: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing rentalVehicleId", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rentalVehicleId, ...rest } = validInput;
    expect(rentalRequestSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects a phone shorter than 10 characters", () => {
    const result = rentalRequestSchema.safeParse({ ...validInput, phone: "05" });
    expect(result.success).toBe(false);
  });
});

describe("rentalRequestResponseSchema", () => {
  it("accepts each valid status", () => {
    for (const status of ["yeni", "gorusuluyor", "sonuclandi"] as const) {
      const result = rentalRequestResponseSchema.safeParse({ status, adminNote: null });
      expect(result.success).toBe(true);
    }
  });
});
