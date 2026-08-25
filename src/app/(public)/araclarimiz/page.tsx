import Link from "next/link";
import type { Metadata } from "next";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { PageHeader } from "@/components/site/page-header";
import { VehicleFilterForm } from "@/components/vehicles/vehicle-filter-form";
import { StockAlertForm } from "@/components/vehicles/stock-alert-form";
import {
  getDistinctBrands,
  getVehicles,
  type VehicleFilters,
} from "@/lib/vehicles/queries";
import type { VehicleCategory } from "@/lib/vehicles/constants";

export const metadata: Metadata = {
  title: "Araçlarımız",
  description:
    "Emirhan Otomotiv güncel araç stoğunu inceleyin; marka, fiyat, model yılı ve kilometreye göre filtreleyin.",
  alternates: { canonical: "/araclarimiz" },
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function parseFilters(searchParams: RawSearchParams): VehicleFilters {
  const get = (key: string) => {
    const value = searchParams[key];
    const first = Array.isArray(value) ? value[0] : value;
    return first || undefined;
  };
  const toNumber = (value?: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  return {
    brand: get("brand"),
    model: get("model"),
    minPrice: toNumber(get("minPrice")),
    maxPrice: toNumber(get("maxPrice")),
    year: toNumber(get("year")),
    maxMileage: toNumber(get("maxMileage")),
    fuelType: get("fuelType"),
    transmission: get("transmission"),
    bodyType: get("bodyType"),
    category: get("category") as VehicleCategory | undefined,
  };
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const [vehicles, brands] = await Promise.all([
    getVehicles(filters),
    getDistinctBrands(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
            <BreadcrumbPage>Araçlarımız</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        eyebrow="Güncel Stok"
        title="Araçlarımız"
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {vehicles.length}
            </span>
            araç listeleniyor
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <VehicleFilterForm brands={brands} searchParams={resolvedSearchParams} />

        <div>
          {vehicles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Aradığınız kriterlere uygun araç bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <StockAlertForm />
          </div>
        </div>
      </div>
    </div>
  );
}
