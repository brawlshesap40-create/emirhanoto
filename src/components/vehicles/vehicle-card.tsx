import Image from "next/image";
import Link from "next/link";
import { Gauge, Fuel, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMileage, formatPrice } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/vehicles/constants";

type VehicleCardData = {
  slug: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuelType: string | null;
  transmission: string | null;
  status: "satista" | "rezerve" | "satildi";
  images: { url: string; altText: string | null }[];
};

export function VehicleCard({ vehicle }: { vehicle: VehicleCardData }) {
  const image = vehicle.images[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? `${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Görsel yok
          </div>
        )}
        {vehicle.status !== "satista" && (
          <Badge
            className="absolute left-3 top-3"
            variant={vehicle.status === "satildi" ? "destructive" : "secondary"}
          >
            {STATUS_LABELS[vehicle.status]}
          </Badge>
        )}
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
            <Gauge className="h-3.5 w-3.5" />
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            {vehicle.fuelType ?? "Belirtilmemiş"}
          </span>
          <span className="flex items-center gap-1">
            <Cog className="h-3.5 w-3.5" />
            {vehicle.transmission ?? "Belirtilmemiş"}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(vehicle.price)}
          </span>
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
