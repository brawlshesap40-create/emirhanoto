"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { useFavorites } from "@/lib/favorites/use-favorites";
import { fetchVehiclesByIds } from "@/lib/vehicles/actions";

type Vehicle = Awaited<ReturnType<typeof fetchVehiclesByIds>>[number];

export default function FavoritesPage() {
  const { ids } = useFavorites();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      const result = await fetchVehiclesByIds(ids);
      if (!cancelled) setVehicles(result);
    });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand">
          Kaydedilenler
        </p>
        <h1 className="mt-1 text-3xl font-normal tracking-tight sm:text-4xl">
          Favorilerim
        </h1>
        <p className="mt-2 text-muted-foreground">
          {loading ? "Yükleniyor..." : `${vehicles.length} araç kaydedildi`}
        </p>
      </div>

      {!loading && vehicles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
          <Heart className="h-8 w-8" />
          <p>Henüz favori araç eklemediniz.</p>
          <p className="text-sm">
            Araç kartlarındaki kalp ikonuna dokunarak buraya ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
