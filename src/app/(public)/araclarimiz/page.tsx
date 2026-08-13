import type { Metadata } from "next";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleFilterForm } from "@/components/vehicles/vehicle-filter-form";
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Araçlarımız
        </h1>
        <p className="mt-2 text-muted-foreground">
          {vehicles.length} araç listeleniyor
        </p>
      </div>

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
        </div>
      </div>
    </div>
  );
}
