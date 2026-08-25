import { describe, expect, it } from "vitest";
import { priceAlertRequestSchema } from "./price-alert";

const validInput = {
  vehicleId: 3,
  fullName: "Kemal Öz",
  phone: "0555 555 66 77",
  email: "kemal@example.com",
};

describe("priceAlertRequestSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(priceAlertRequestSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects a missing vehicleId", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { vehicleId, ...rest } = validInput;
    expect(priceAlertRequestSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects a negative vehicleId", () => {
    const result = priceAlertRequestSchema.safeParse({ ...validInput, vehicleId: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects a full name shorter than 2 characters", () => {
    const result = priceAlertRequestSchema.safeParse({ ...validInput, fullName: "K" });
    expect(result.success).toBe(false);
  });
});
