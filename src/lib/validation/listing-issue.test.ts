import { describe, expect, it } from "vitest";
import { listingIssueReportSchema } from "./listing-issue";

const validInput = {
  vehicleId: 11,
  message: "Fiyat bilgisi güncel değil gibi görünüyor.",
  email: "bildiren@example.com",
};

describe("listingIssueReportSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(listingIssueReportSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts a submission without an email", () => {
    const result = listingIssueReportSchema.safeParse({ ...validInput, email: "" });
    expect(result.success).toBe(true);
  });

  it("rejects a message shorter than 5 characters", () => {
    const result = listingIssueReportSchema.safeParse({ ...validInput, message: "Kısa" });
    expect(result.success).toBe(false);
  });

  it("rejects a message longer than the 2000 character cap", () => {
    const result = listingIssueReportSchema.safeParse({
      ...validInput,
      message: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
