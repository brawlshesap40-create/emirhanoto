import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Eye, FileText, Home, MessageCircle } from "lucide-react";
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
import { VehicleSpecs } from "@/components/vehicles/vehicle-specs";
import { VehicleFeatures } from "@/components/vehicles/vehicle-features";
import { VehicleExpertise } from "@/components/vehicles/vehicle-expertise";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { InstallmentEstimate } from "@/components/vehicles/installment-estimate";
import { ShareButton } from "@/components/vehicles/share-button";
import { PriceAlertDialogTrigger } from "@/components/vehicles/price-alert-dialog";
import { CreditApplicationDialogTrigger } from "@/components/vehicles/credit-application-dialog";
import { ListingIssueDialogTrigger } from "@/components/vehicles/listing-issue-dialog";
import { TestDriveDialogTrigger } from "@/components/site/test-drive-dialog";
import {
  getSimilarVehicles,
  getVehicleBySlug,
  incrementVehicleView,
} from "@/lib/vehicles/queries";
import { formatMileage, formatPrice } from "@/lib/format";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/vehicles/constants";
import { buildOrganizationJsonLd, buildWhatsAppUrl, siteConfig } from "@/lib/site-config";

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
  const description = `${title} - ${formatMileage(vehicle.mileage)}, ${formatPrice(
    vehicle.price
  )}. Emirhan Otomotiv güvencesiyle.`;
  const image = vehicle.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.siteUrl}/araclarimiz/${vehicle.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
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

  await incrementVehicleView(vehicle.id);
  const similarVehicles = await getSimilarVehicles(vehicle);

  const whatsappMessage = `Merhaba, sitedeki ${vehicle.brand} ${vehicle.model} ilanı hakkında bilgi almak istiyorum.`;
  const vehicleUrl = `${siteConfig.siteUrl}/araclarimiz/${vehicle.slug}`;
  const priceDropped = vehicle.previousPrice != null && vehicle.previousPrice > vehicle.price;

  // Server Component rendered fresh per request; per-request freshness is intended here.
  // eslint-disable-next-line react-hooks/purity
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    brand: vehicle.brand,
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    itemCondition: "https://schema.org/UsedCondition",
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "KMT",
    },
    fuelType: vehicle.fuelType ?? undefined,
    vehicleTransmission: vehicle.transmission ?? undefined,
    image: vehicle.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "TRY",
      priceValidUntil,
      itemCondition: "https://schema.org/UsedCondition",
      availability:
        vehicle.status === "satista"
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
            <BreadcrumbLink render={<Link href="/araclarimiz" />}>Araçlarımız</BreadcrumbLink>
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
            videoUrl={vehicle.videoUrl}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              {vehicle.status !== "satista" && (
                <Badge variant={vehicle.status === "satildi" ? "destructive" : "secondary"}>
                  {STATUS_LABELS[vehicle.status]}
                </Badge>
              )}
              {priceDropped && <Badge variant="destructive">Fiyatı Düştü</Badge>}
            </div>
            <h1 className="mt-2 text-2xl font-normal tracking-tight sm:text-3xl">
              {vehicle.brand} {vehicle.model}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
              <span>
                {vehicle.year} Model &middot; {formatMileage(vehicle.mileage)} &middot;{" "}
                {CATEGORY_LABELS[vehicle.category]}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Eye className="h-3.5 w-3.5" />
                {vehicle.viewCount + 1} kez görüntülendi
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Fiyat</p>
                {priceDropped && vehicle.previousPrice != null && (
                  <p className="text-sm text-muted-foreground line-through tabular-nums">
                    {formatPrice(vehicle.previousPrice)}
                  </p>
                )}
                <p className="text-3xl font-extrabold tabular-nums">
                  {formatPrice(vehicle.price)}
                </p>
              </div>
              <ShareButton
                title={`${vehicle.brand} ${vehicle.model}`}
                url={vehicleUrl}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                🏦 Kredi ve taksit seçenekleri mevcuttur
              </p>
              <PriceAlertDialogTrigger
                vehicleId={vehicle.id}
                vehicleName={`${vehicle.brand} ${vehicle.model}`}
              />
            </div>
          </div>

          <InstallmentEstimate price={vehicle.price} />

          <CreditApplicationDialogTrigger
            vehicleId={vehicle.id}
            vehicleName={`${vehicle.brand} ${vehicle.model}`}
          />

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

          <TestDriveDialogTrigger
            vehicleId={vehicle.id}
            vehicleName={`${vehicle.brand} ${vehicle.model}`}
            size="lg"
            variant="outline"
            className="w-full"
          >
            Test Sürüşü Talebi Oluştur
          </TestDriveDialogTrigger>

          {vehicle.expertiseReportUrl && (
            <a
              href={vehicle.expertiseReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 p-3 text-sm font-medium text-brand transition-colors hover:bg-brand/15"
            >
              <FileText className="h-4 w-4 shrink-0" />
              Ekspertiz Raporunu İndir (PDF)
            </a>
          )}

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

          <ListingIssueDialogTrigger vehicleId={vehicle.id} />
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

      {similarVehicles.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 text-xl font-bold">Benzer Araçlar</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similarVehicles.map((similar) => (
              <VehicleCard key={similar.id} vehicle={similar} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
