import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Home, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehicleFeatures } from "@/components/vehicles/vehicle-features";
import { RentalVehicleSpecs } from "@/components/rentals/rental-vehicle-specs";
import { RentalVehicleCard } from "@/components/rentals/rental-vehicle-card";
import { RentalRequestDialogTrigger } from "@/components/rentals/rental-request-dialog";
import {
  getRentalVehicleBySlug,
  getSimilarRentalVehicles,
} from "@/lib/rentals/queries";
import { formatPrice } from "@/lib/format";
import { RENTAL_CATEGORY_LABELS, RENTAL_STATUS_LABELS } from "@/lib/rentals/constants";
import { buildOrganizationJsonLd, buildWhatsAppUrl, siteConfig } from "@/lib/site-config";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getRentalVehicleBySlug(slug);
  if (!vehicle) return {};

  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.year} Kiralama`;
  const description = `${title} - Günlük ${formatPrice(vehicle.dailyPrice)}. Emirhan Otomotiv güvencesiyle.`;
  const image = vehicle.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/kiralama/${vehicle.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.siteUrl}/kiralama/${vehicle.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function RentalVehicleDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const vehicle = await getRentalVehicleBySlug(slug);
  if (!vehicle) notFound();

  const similarVehicles = await getSimilarRentalVehicles(vehicle);
  const whatsappMessage = `Merhaba, sitedeki ${vehicle.brand} ${vehicle.model} kiralama ilanı hakkında bilgi almak istiyorum.`;
  const vehicleUrl = `${siteConfig.siteUrl}/kiralama/${vehicle.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    brand: vehicle.brand,
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    fuelType: vehicle.fuelType ?? undefined,
    vehicleTransmission: vehicle.transmission ?? undefined,
    image: vehicle.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      price: vehicle.dailyPrice,
      priceCurrency: "TRY",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: vehicle.dailyPrice,
        priceCurrency: "TRY",
        unitText: "GÜN",
      },
      availability:
        vehicle.status === "musait"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: vehicleUrl,
      seller: buildOrganizationJsonLd(),
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              <Home className="h-3.5 w-3.5" />
              Ana Sayfa
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/kiralama" />}>Kiralama</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {vehicle.brand} {vehicle.model} {vehicle.year}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
        <div>
          <VehicleGallery
            images={vehicle.images}
            vehicleName={`${vehicle.brand} ${vehicle.model}`}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              {vehicle.status !== "musait" && (
                <Badge variant={vehicle.status === "bakimda" ? "destructive" : "secondary"}>
                  {RENTAL_STATUS_LABELS[vehicle.status]}
                </Badge>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-normal tracking-tight sm:text-3xl">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {vehicle.year} Model &middot; {RENTAL_CATEGORY_LABELS[vehicle.category]}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Günlük</p>
                <p className="text-2xl font-extrabold tabular-nums">
                  {formatPrice(vehicle.dailyPrice)}
                </p>
              </div>
              {vehicle.weeklyPrice != null && (
                <div>
                  <p className="text-sm text-muted-foreground">Haftalık</p>
                  <p className="text-2xl font-extrabold tabular-nums">
                    {formatPrice(vehicle.weeklyPrice)}
                  </p>
                </div>
              )}
              {vehicle.monthlyPrice != null && (
                <div>
                  <p className="text-sm text-muted-foreground">Aylık</p>
                  <p className="text-2xl font-extrabold tabular-nums">
                    {formatPrice(vehicle.monthlyPrice)}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
              {vehicle.deposit != null && (
                <span>Depozito: {formatPrice(vehicle.deposit)}</span>
              )}
              <span>Minimum kiralama: {vehicle.minRentalDays} gün</span>
            </div>
          </div>

          <RentalRequestDialogTrigger
            vehicleId={vehicle.id}
            vehicleName={`${vehicle.brand} ${vehicle.model}`}
          />

          <Button
            size="lg"
            variant="outline"
            className="w-full"
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
          <RentalVehicleSpecs vehicle={vehicle} />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold">Donanım</h2>
          <VehicleFeatures features={vehicle.features} />
        </section>
      </div>

      {similarVehicles.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 text-xl font-bold">Benzer Kiralık Araçlar</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similarVehicles.map((similar) => (
              <RentalVehicleCard key={similar.id} vehicle={similar} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
