import Image from "next/image";
import Link from "next/link";
import { Fuel, Cog, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { RENTAL_STATUS_LABELS } from "@/lib/rentals/constants";

type RentalVehicleCardData = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  year: number;
  dailyPrice: number;
  fuelType: string | null;
  transmission: string | null;
  seatCount: number | null;
  status: "musait" | "kirada" | "bakimda";
  images: { url: string; altText: string | null }[];
};

export function RentalVehicleCard({ vehicle }: { vehicle: RentalVehicleCardData }) {
  const image = vehicle.images[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--brand),transparent_75%),0_16px_40px_-16px_rgba(0,0,0,0.7)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? `${vehicle.brand} ${vehicle.model}`}
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
          {vehicle.status !== "musait" && (
            <Badge variant={vehicle.status === "bakimda" ? "destructive" : "secondary"}>
              {RENTAL_STATUS_LABELS[vehicle.status]}
            </Badge>
          )}
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
            <Fuel className="h-3.5 w-3.5 text-muted-foreground/70" />
            {vehicle.fuelType ?? "Belirtilmemiş"}
          </span>
          <span className="flex items-center gap-1">
            <Cog className="h-3.5 w-3.5 text-muted-foreground/70" />
            {vehicle.transmission ?? "Belirtilmemiş"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground/70" />
            {vehicle.seatCount ? `${vehicle.seatCount} Kişi` : "Belirtilmemiş"}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
          <div>
            <span className="block text-xs text-muted-foreground">Günlük</span>
            <span className="text-lg font-bold tabular-nums text-foreground">
              {formatPrice(vehicle.dailyPrice)}
            </span>
          </div>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/kiralama/${vehicle.slug}`} />}
          >
            Detayları İncele
          </Button>
        </div>
      </div>
    </div>
  );
}
