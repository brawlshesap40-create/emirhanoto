import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { getFeaturedVehicles } from "@/lib/vehicles/queries";

export async function FeaturedVehiclesSection() {
  const vehicles = await getFeaturedVehicles(6);

  if (vehicles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Öne Çıkan Araçlar
          </h2>
          <p className="mt-2 text-muted-foreground">
            Güncel stoğumuzdan özenle seçilmiş araçlar.
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link href="/araclarimiz" />}>
          Tüm Araçları Gör
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
