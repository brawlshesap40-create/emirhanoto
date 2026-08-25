import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RentalVehicleForm } from "@/components/admin/rental-vehicle-form";
import { getRentalVehicleForEdit } from "@/lib/rentals/admin-queries";

export const metadata: Metadata = {
  title: "Kiralık Aracı Düzenle",
  robots: { index: false, follow: false },
};

type Params = { id: string };

export default async function EditRentalVehiclePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const vehicleId = Number(id);
  if (!Number.isInteger(vehicleId)) notFound();

  const vehicle = await getRentalVehicleForEdit(vehicleId);
  if (!vehicle) notFound();

  const defaultValues = {
    brand: vehicle.brand,
    model: vehicle.model,
    year: String(vehicle.year),
    category: vehicle.category,
    transmission: vehicle.transmission ?? "",
    fuelType: vehicle.fuelType ?? "",
    seatCount: vehicle.seatCount ? String(vehicle.seatCount) : "",
    doorCount: vehicle.doorCount ? String(vehicle.doorCount) : "",
    color: vehicle.color ?? "",
    dailyPrice: String(vehicle.dailyPrice),
    weeklyPrice: vehicle.weeklyPrice ? String(vehicle.weeklyPrice) : "",
    monthlyPrice: vehicle.monthlyPrice ? String(vehicle.monthlyPrice) : "",
    deposit: vehicle.deposit ? String(vehicle.deposit) : "",
    minRentalDays: String(vehicle.minRentalDays),
    description: vehicle.description ?? "",
    status: vehicle.status,
    isFeatured: vehicle.isFeatured,
    features: vehicle.features.map((f) => f.label),
    images: vehicle.images.map((image) => ({
      url: image.url,
      altText: image.altText ?? "",
      category: image.category ?? "",
    })),
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {vehicle.brand} {vehicle.model} - Düzenle
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Araç bilgilerini güncelleyin.
        </p>
      </div>
      <RentalVehicleForm vehicleId={vehicle.id} defaultValues={defaultValues} />
    </div>
  );
}
