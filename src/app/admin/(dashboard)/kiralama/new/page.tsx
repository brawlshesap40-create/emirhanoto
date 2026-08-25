import type { Metadata } from "next";
import { RentalVehicleForm } from "@/components/admin/rental-vehicle-form";

export const metadata: Metadata = {
  title: "Yeni Kiralık Araç Ekle",
  robots: { index: false, follow: false },
};

export default function NewRentalVehiclePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Yeni Kiralık Araç Ekle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Araç bilgilerini eksiksiz doldurun.
        </p>
      </div>
      <RentalVehicleForm />
    </div>
  );
}
