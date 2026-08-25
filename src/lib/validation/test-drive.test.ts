import { describe, expect, it } from "vitest";
import { testDriveRequestSchema, testDriveResponseSchema } from "./test-drive";

const validInput = {
  vehicleId: 7,
  fullName: "Fatma Şahin",
  phone: "0555 444 55 66",
  email: "fatma@example.com",
  preferredDate: "2026-09-01",
  preferredTimeSlot: "13:00 - 15:00",
  viaVideoCall: false,
  note: "Cumartesi uygun olurum.",
};

describe("testDriveRequestSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(testDriveRequestSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects a non-positive vehicleId", () => {
    const result = testDriveRequestSchema.safeParse({ ...validInput, vehicleId: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a phone shorter than 10 characters", () => {
    const result = testDriveRequestSchema.safeParse({ ...validInput, phone: "05" });
    expect(result.success).toBe(false);
  });

  it("rejects a note longer than the 2000 character cap", () => {
    const result = testDriveRequestSchema.safeParse({
      ...validInput,
      note: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

describe("testDriveResponseSchema", () => {
  it("accepts each valid status", () => {
    for (const status of ["yeni", "onaylandi", "tamamlandi", "iptal"] as const) {
      const result = testDriveResponseSchema.safeParse({ status, adminNote: null });
      expect(result.success).toBe(true);
    }
  });
});
