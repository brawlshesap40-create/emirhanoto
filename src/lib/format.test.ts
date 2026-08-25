import { describe, expect, it } from "vitest";
import { formatMileage, formatNumber, formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats a positive integer as Turkish lira without decimals", () => {
    expect(formatPrice(3450000)).toBe("₺3.450.000");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("₺0");
  });
});

describe("formatMileage", () => {
  it("formats mileage with thousands separator and km suffix", () => {
    expect(formatMileage(42000)).toBe("42.000 km");
  });

  it("formats zero mileage", () => {
    expect(formatMileage(0)).toBe("0 km");
  });
});

describe("formatNumber", () => {
  it("formats large numbers with Turkish thousands separators", () => {
    expect(formatNumber(1234567)).toBe("1.234.567");
  });
});
