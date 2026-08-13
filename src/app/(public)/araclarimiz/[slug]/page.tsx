import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehicleSpecs } from "@/components/vehicles/vehicle-specs";
import { VehicleFeatures } from "@/components/vehicles/vehicle-features";
import { VehicleExpertise } from "@/components/vehicles/vehicle-expertise";
import { getVehicleBySlug } from "@/lib/vehicles/queries";
import { formatMileage, formatPrice } from "@/lib/format";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/vehicles/constants";
import { buildWhatsAppUrl } from "@/lib/site-config";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return {};

  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
  return {
    title,
    description: `${title} - ${formatMileage(vehicle.mileage)}, ${formatPrice(
      vehicle.price
    )}. Emirhan Otomotiv güvencesiyle.`,
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const whatsappMessage = `Merhaba, sitedeki ${vehicle.brand} ${vehicle.model} ilanı hakkında bilgi almak istiyorum.`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
        <div>
          <VehicleGallery
            images={vehicle.images}
            vehicleName={`${vehicle.brand} ${vehicle.model}`}
          />
        </div>

        <div className="space-y-6">
          <div>
            {vehicle.status !== "satista" && (
              <Badge
                variant={vehicle.status === "satildi" ? "destructive" : "secondary"}
                className="mb-2"
              >
                {STATUS_LABELS[vehicle.status]}
              </Badge>
            )}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {vehicle.year} Model &middot; {formatMileage(vehicle.mileage)} &middot;{" "}
              {CATEGORY_LABELS[vehicle.category]}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Fiyat</p>
            <p className="text-3xl font-extrabold">{formatPrice(vehicle.price)}</p>
          </div>

          <Button
            size="lg"
            className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
            nativeButton={false}
            render={
              <a
                href={buildWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp&apos;tan Bilgi Al
          </Button>

          {vehicle.description && (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Açıklama
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {vehicle.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-bold">Teknik Özellikler</h2>
          <VehicleSpecs vehicle={vehicle} />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold">Donanım</h2>
          <VehicleFeatures features={vehicle.features} />
        </section>
      </div>

      <div className="mt-14 max-w-3xl">
        <h2 className="mb-4 text-xl font-bold">Ekspertiz ve Hasar Bilgileri</h2>
        <VehicleExpertise vehicle={vehicle} />
      </div>
    </div>
  );
}
