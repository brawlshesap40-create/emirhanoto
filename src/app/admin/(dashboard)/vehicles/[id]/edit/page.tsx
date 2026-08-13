import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { getVehicleForEdit } from "@/lib/vehicles/admin-queries";

export const metadata: Metadata = {
  title: "Aracı Düzenle",
  robots: { index: false, follow: false },
};

type Params = { id: string };

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const vehicleId = Number(id);
  if (!Number.isInteger(vehicleId)) notFound();

  const vehicle = await getVehicleForEdit(vehicleId);
  if (!vehicle) notFound();

  const defaultValues = {
    brand: vehicle.brand,
    model: vehicle.model,
    year: String(vehicle.year),
    mileage: String(vehicle.mileage),
    price: String(vehicle.price),
    category: vehicle.category,
    engine: vehicle.engine ?? "",
    engineDisplacement: vehicle.engineDisplacement ?? "",
    enginePower: vehicle.enginePower ?? "",
    fuelType: vehicle.fuelType ?? "",
    transmission: vehicle.transmission ?? "",
    drivetrain: vehicle.drivetrain ?? "",
    bodyType: vehicle.bodyType ?? "",
    color: vehicle.color ?? "",
    doorCount: vehicle.doorCount ? String(vehicle.doorCount) : "",
    description: vehicle.description ?? "",
    status: vehicle.status,
    isFeatured: vehicle.isFeatured,
    engineCondition: vehicle.engineCondition ?? "",
    transmissionCondition: vehicle.transmissionCondition ?? "",
    bodyCondition: vehicle.bodyCondition ?? "",
    paintCondition: vehicle.paintCondition ?? "",
    changedParts: vehicle.changedParts ?? "",
    damageStatus: vehicle.damageStatus,
    damageInfo: vehicle.damageInfo ?? "",
    expertiseReportUrl: vehicle.expertiseReportUrl ?? "",
    features: vehicle.features.map((f) => f.label),
    images: vehicle.images.map((image) => ({
      url: image.url,
      altText: image.altText ?? "",
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
      <VehicleForm vehicleId={vehicle.id} defaultValues={defaultValues} />
    </div>
  );
}
