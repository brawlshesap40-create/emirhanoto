import { describe, expect, it } from "vitest";
import { creditApplicationResponseSchema, creditApplicationSchema } from "./credit-application";

const validInput = {
  vehicleId: 42,
  fullName: "Mehmet Demir",
  phone: "0555 333 44 55",
  email: "mehmet@example.com",
  note: "Peşinat 300.000 TL olabilir.",
};

describe("creditApplicationSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(creditApplicationSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts a submission without a vehicleId (general inquiry)", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { vehicleId, ...rest } = validInput;
    expect(creditApplicationSchema.safeParse(rest).success).toBe(true);
  });

  it("rejects a phone shorter than 10 characters", () => {
    const result = creditApplicationSchema.safeParse({ ...validInput, phone: "555" });
    expect(result.success).toBe(false);
  });

  it("rejects a note longer than the 2000 character cap", () => {
    const result = creditApplicationSchema.safeParse({
      ...validInput,
      note: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

describe("creditApplicationResponseSchema", () => {
  it("accepts a valid admin response", () => {
    const result = creditApplicationResponseSchema.safeParse({
      status: "sonuclandi",
      adminNote: "Onaylandı",
    });
    expect(result.success).toBe(true);
  });
});
