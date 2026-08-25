"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/lib/compare/use-compare";
import { fetchVehiclesByIds } from "@/lib/vehicles/actions";
import { formatMileage, formatPrice } from "@/lib/format";

type Vehicle = Awaited<ReturnType<typeof fetchVehiclesByIds>>[number];

const FALLBACK = "Belirtilmemiş";

const ROWS: { label: string; value: (v: Vehicle) => string }[] = [
  { label: "Fiyat", value: (v) => formatPrice(v.price) },
  { label: "Model Yılı", value: (v) => String(v.year) },
  { label: "Kilometre", value: (v) => formatMileage(v.mileage) },
  { label: "Motor", value: (v) => v.engine ?? FALLBACK },
  { label: "Motor Hacmi", value: (v) => v.engineDisplacement ?? FALLBACK },
  { label: "Motor Gücü", value: (v) => v.enginePower ?? FALLBACK },
  { label: "Yakıt Tipi", value: (v) => v.fuelType ?? FALLBACK },
  { label: "Şanzıman", value: (v) => v.transmission ?? FALLBACK },
  { label: "Çekiş", value: (v) => v.drivetrain ?? FALLBACK },
  { label: "Kasa Tipi", value: (v) => v.bodyType ?? FALLBACK },
  { label: "Renk", value: (v) => v.color ?? FALLBACK },
  {
    label: "Kapı Sayısı",
    value: (v) => (v.doorCount ? String(v.doorCount) : FALLBACK),
  },
];

function CompareContent() {
  const searchParams = useSearchParams();
  const { toggle } = useCompare();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, startTransition] = useTransition();

  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id));

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      const result = await fetchVehiclesByIds(ids);
      if (!cancelled) {
        const ordered = ids
          .map((id) => result.find((v) => v.id === id))
          .filter((v): v is Vehicle => Boolean(v));
        setVehicles(ordered);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsParam]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand">
          Karşılaştırma
        </p>
        <h1 className="mt-1 text-3xl font-normal tracking-tight sm:text-4xl">
          Araçları Karşılaştır
        </h1>
      </div>

      {!loading && vehicles.length < 2 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
          Karşılaştırmak için araç kartlarından en az 2 araç seçin.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40" />
                {vehicles.map((vehicle) => {
                  const image = vehicle.images[0];
                  return (
                    <th key={vehicle.id} className="min-w-[200px] px-3 pb-4 text-left align-bottom">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            sizes="240px"
                            className="object-cover"
                          />
                        ) : null}
                        <button
                          type="button"
                          onClick={() => toggle(vehicle.id)}
                          aria-label="Karşılaştırmadan çıkar"
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <Link
                        href={`/araclarimiz/${vehicle.slug}`}
                        className="mt-2 block text-sm font-semibold hover:underline"
                      >
                        {vehicle.brand} {vehicle.model}
                      </Link>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, index) => (
                <tr key={row.label} className={index % 2 === 0 ? "bg-card" : ""}>
                  <td className="whitespace-nowrap rounded-l-lg px-3 py-3 text-sm font-medium text-muted-foreground">
                    {row.label}
                  </td>
                  {vehicles.map((vehicle) => (
                    <td key={vehicle.id} className="px-3 py-3 text-sm font-medium tabular-nums">
                      {row.value(vehicle)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <Button variant="outline" nativeButton={false} render={<Link href="/araclarimiz" />}>
          Araçlara Dön
        </Button>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  );
}
