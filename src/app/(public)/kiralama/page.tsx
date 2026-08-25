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
import { RentalVehicleCard } from "@/components/rentals/rental-vehicle-card";
import { PageHeader } from "@/components/site/page-header";
import { RentalFilterForm } from "@/components/rentals/rental-filter-form";
import {
  getDistinctRentalBrands,
  getRentalVehicles,
  type RentalVehicleFilters,
} from "@/lib/rentals/queries";
import type { RentalVehicleCategory } from "@/lib/rentals/constants";

export const metadata: Metadata = {
  title: "Kiralama",
  description:
    "Emirhan Otomotiv kiralık araç filosunu inceleyin; marka, kategori ve günlük fiyata göre filtreleyin.",
  alternates: { canonical: "/kiralama" },
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function parseFilters(searchParams: RawSearchParams): RentalVehicleFilters {
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
    minDailyPrice: toNumber(get("minDailyPrice")),
    maxDailyPrice: toNumber(get("maxDailyPrice")),
    fuelType: get("fuelType"),
    transmission: get("transmission"),
    category: get("category") as RentalVehicleCategory | undefined,
  };
}

export default async function RentalVehiclesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const [vehicles, brands] = await Promise.all([
    getRentalVehicles(filters),
    getDistinctRentalBrands(),
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
            <BreadcrumbPage>Kiralama</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        eyebrow="Kiralık Araç Filosu"
        title="Kiralama"
        description="Günlük, haftalık ve aylık kiralama seçenekleriyle ihtiyacınıza uygun aracı bulun."
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
        <RentalFilterForm brands={brands} searchParams={resolvedSearchParams} />

        <div>
          {vehicles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Aradığınız kriterlere uygun kiralık araç bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((vehicle) => (
                <RentalVehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
