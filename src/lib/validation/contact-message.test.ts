import { describe, expect, it } from "vitest";
import { contactMessageSchema } from "./contact-message";

const validInput = {
  fullName: "Ahmet Yılmaz",
  phone: "0555 111 22 33",
  email: "ahmet@example.com",
  message: "Merhaba, aracınız hakkında bilgi almak istiyorum.",
};

describe("contactMessageSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(contactMessageSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts an empty phone/email since they're optional", () => {
    const result = contactMessageSchema.safeParse({
      ...validInput,
      phone: "",
      email: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a full name shorter than 2 characters", () => {
    const result = contactMessageSchema.safeParse({ ...validInput, fullName: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects a message shorter than 5 characters", () => {
    const result = contactMessageSchema.safeParse({ ...validInput, message: "Hi" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed email", () => {
    const result = contactMessageSchema.safeParse({
      ...validInput,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message longer than the 3000 character cap", () => {
    const result = contactMessageSchema.safeParse({
      ...validInput,
      message: "a".repeat(3001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a message right at the 3000 character cap", () => {
    const result = contactMessageSchema.safeParse({
      ...validInput,
      message: "a".repeat(3000),
    });
    expect(result.success).toBe(true);
  });
});
