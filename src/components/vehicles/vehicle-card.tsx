import Image from "next/image";
import Link from "next/link";
import { Gauge, Fuel, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/vehicles/favorite-button";
import { CompareCheckbox } from "@/components/vehicles/compare-checkbox";
import { formatMileage, formatPrice } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/vehicles/constants";

const NEW_THRESHOLD_DAYS = 7;
const AVERAGE_KM_PER_YEAR = 20000;
const LOW_MILEAGE_RATIO = 0.7;

type VehicleCardData = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  previousPrice?: number | null;
  createdAt?: Date;
  fuelType: string | null;
  transmission: string | null;
  status: "satista" | "rezerve" | "satildi";
  images: { url: string; altText: string | null }[];
};

export function VehicleCard({ vehicle }: { vehicle: VehicleCardData }) {
  const image = vehicle.images[0];
  // Server Component rendered fresh per request; per-request freshness is intended here.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const isNew =
    vehicle.createdAt &&
    now - new Date(vehicle.createdAt).getTime() < NEW_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
  const priceDropped =
    vehicle.previousPrice != null && vehicle.previousPrice > vehicle.price;
  const currentYear = new Date(now).getFullYear();
  const ageYears = Math.max(currentYear - vehicle.year, 1);
  const isLowMileage = vehicle.mileage < ageYears * AVERAGE_KM_PER_YEAR * LOW_MILEAGE_RATIO;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--brand),transparent_75%),0_16px_40px_-16px_rgba(0,0,0,0.7)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? `${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Görsel yok
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {vehicle.status !== "satista" && (
            <Badge variant={vehicle.status === "satildi" ? "destructive" : "secondary"}>
              {STATUS_LABELS[vehicle.status]}
            </Badge>
          )}
          {isNew && <Badge className="bg-brand text-brand-foreground">Yeni</Badge>}
          {priceDropped && <Badge variant="destructive">Fiyatı Düştü</Badge>}
          {isLowMileage && vehicle.status === "satista" && (
            <Badge variant="secondary">Düşük KM</Badge>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <FavoriteButton vehicleId={vehicle.id} />
          <CompareCheckbox vehicleId={vehicle.id} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-sm text-muted-foreground">{vehicle.year} Model</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5 text-muted-foreground/70" />
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5 text-muted-foreground/70" />
            {vehicle.fuelType ?? "Belirtilmemiş"}
          </span>
          <span className="flex items-center gap-1">
            <Cog className="h-3.5 w-3.5 text-muted-foreground/70" />
            {vehicle.transmission ?? "Belirtilmemiş"}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
          <div>
            {priceDropped && vehicle.previousPrice != null && (
              <span className="block text-xs text-muted-foreground line-through tabular-nums">
                {formatPrice(vehicle.previousPrice)}
              </span>
            )}
            <span className="text-lg font-bold tabular-nums text-foreground">
              {formatPrice(vehicle.price)}
            </span>
          </div>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/araclarimiz/${vehicle.slug}`} />}
          >
            Detayları İncele
          </Button>
        </div>
      </div>
    </div>
  );
}
