import { describe, expect, it } from "vitest";
import { stockAlertSubscriptionSchema } from "./stock-alert";

describe("stockAlertSubscriptionSchema", () => {
  it("accepts a valid email with optional brand/category", () => {
    const result = stockAlertSubscriptionSchema.safeParse({
      email: "takip@example.com",
      brand: "Ford",
      category: "ticari",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an email alone, with brand/category omitted", () => {
    const result = stockAlertSubscriptionSchema.safeParse({
      email: "takip@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = stockAlertSubscriptionSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a category outside the known vehicle categories", () => {
    const result = stockAlertSubscriptionSchema.safeParse({
      email: "takip@example.com",
      category: "motosiklet",
    });
    expect(result.success).toBe(false);
  });
});
