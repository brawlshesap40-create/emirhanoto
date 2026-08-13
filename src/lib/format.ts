export function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(mileage: number) {
  return `${new Intl.NumberFormat("tr-TR").format(mileage)} km`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}
