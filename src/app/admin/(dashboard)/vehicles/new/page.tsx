import type { Metadata } from "next";
import { VehicleForm } from "@/components/admin/vehicle-form";

export const metadata: Metadata = {
  title: "Yeni Araç Ekle",
  robots: { index: false, follow: false },
};

export default function NewVehiclePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Yeni Araç Ekle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Araç bilgilerini eksiksiz doldurun.
        </p>
      </div>
      <VehicleForm />
    </div>
  );
}
