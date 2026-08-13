import { formatMileage } from "@/lib/format";

type SpecsSource = {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  engine: string | null;
  engineDisplacement: string | null;
  enginePower: string | null;
  fuelType: string | null;
  transmission: string | null;
  drivetrain: string | null;
  bodyType: string | null;
  color: string | null;
  doorCount: number | null;
};

const FALLBACK = "Belirtilmemiş";

export function VehicleSpecs({ vehicle }: { vehicle: SpecsSource }) {
  const specs: { label: string; value: string }[] = [
    { label: "Marka", value: vehicle.brand },
    { label: "Model", value: vehicle.model },
    { label: "Model Yılı", value: String(vehicle.year) },
    { label: "Kilometre", value: formatMileage(vehicle.mileage) },
    { label: "Motor", value: vehicle.engine ?? FALLBACK },
    { label: "Motor Hacmi", value: vehicle.engineDisplacement ?? FALLBACK },
    { label: "Motor Gücü", value: vehicle.enginePower ?? FALLBACK },
    { label: "Yakıt Tipi", value: vehicle.fuelType ?? FALLBACK },
    { label: "Şanzıman", value: vehicle.transmission ?? FALLBACK },
    { label: "Çekiş", value: vehicle.drivetrain ?? FALLBACK },
    { label: "Kasa Tipi", value: vehicle.bodyType ?? FALLBACK },
    { label: "Renk", value: vehicle.color ?? FALLBACK },
    {
      label: "Kapı Sayısı",
      value: vehicle.doorCount ? String(vehicle.doorCount) : FALLBACK,
    },
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex items-center justify-between border-b border-border/60 py-2 text-sm"
        >
          <dt className="text-muted-foreground">{spec.label}</dt>
          <dd className="font-medium">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
