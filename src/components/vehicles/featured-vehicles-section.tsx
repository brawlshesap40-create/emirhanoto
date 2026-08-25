import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { getFeaturedVehicles } from "@/lib/vehicles/queries";
import { formatMileage, formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/vehicles/constants";
import { SectionHeading } from "@/components/site/section-heading";

export async function FeaturedVehiclesSection() {
  const vehicles = await getFeaturedVehicles(7);

  if (vehicles.length === 0) return null;

  const [spotlight, ...rest] = vehicles;
  const spotlightImage = spotlight.images[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <SectionHeading
        eyebrow="02 — Güncel Stok"
        title="Öne Çıkan Araçlar"
        description="Güncel stoğumuzdan özenle seçilmiş araçlar."
        action={
          <Button variant="outline" nativeButton={false} render={<Link href="/araclarimiz" />}>
            Tüm Araçları Gör
            <ArrowRight className="h-4 w-4" />
          </Button>
        }
      />

      <Link
        href={`/araclarimiz/${spotlight.slug}`}
        className="group mb-6 grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-brand/30 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] lg:grid-cols-2"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted lg:aspect-auto">
          {spotlightImage ? (
            <Image
              src={spotlightImage.url}
              alt={spotlightImage.altText ?? `${spotlight.brand} ${spotlight.model} ${spotlight.year}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              Görsel yok
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
          <span className="w-fit rounded-full bg-brand/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-brand">
            Vitrin
          </span>
          <h3 className="text-2xl font-normal tracking-tight sm:text-3xl">
            {spotlight.brand} {spotlight.model}
          </h3>
          <p className="text-muted-foreground">
            {spotlight.year} Model &middot; {formatMileage(spotlight.mileage)} &middot;{" "}
            {CATEGORY_LABELS[spotlight.category]}
          </p>
          <p className="text-3xl font-extrabold tabular-nums">{formatPrice(spotlight.price)}</p>
          <span className="flex w-fit items-center gap-2 text-sm font-medium text-brand transition-transform duration-300 group-hover:translate-x-1">
            Detayları İncele
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
