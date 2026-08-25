import { RENTAL_CATEGORY_LABELS, type RentalVehicleCategory } from "@/lib/rentals/constants";

type SpecsSource = {
  brand: string;
  model: string;
  year: number;
  category: RentalVehicleCategory;
  transmission: string | null;
  fuelType: string | null;
  seatCount: number | null;
  doorCount: number | null;
  color: string | null;
};

const FALLBACK = "Belirtilmemiş";

export function RentalVehicleSpecs({ vehicle }: { vehicle: SpecsSource }) {
  const specs: { label: string; value: string }[] = [
    { label: "Marka", value: vehicle.brand },
    { label: "Model", value: vehicle.model },
    { label: "Model Yılı", value: String(vehicle.year) },
    { label: "Kategori", value: RENTAL_CATEGORY_LABELS[vehicle.category] },
    { label: "Yakıt Tipi", value: vehicle.fuelType ?? FALLBACK },
    { label: "Şanzıman", value: vehicle.transmission ?? FALLBACK },
    {
      label: "Koltuk Sayısı",
      value: vehicle.seatCount ? String(vehicle.seatCount) : FALLBACK,
    },
    {
      label: "Kapı Sayısı",
      value: vehicle.doorCount ? String(vehicle.doorCount) : FALLBACK,
    },
    { label: "Renk", value: vehicle.color ?? FALLBACK },
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex items-center justify-between rounded-md border-b border-border/60 px-2 py-2.5 text-sm transition-colors hover:bg-card"
        >
          <dt className="text-muted-foreground">{spec.label}</dt>
          <dd className="font-medium tabular-nums">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
