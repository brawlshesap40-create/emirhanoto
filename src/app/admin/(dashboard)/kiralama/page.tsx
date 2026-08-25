import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Pencil, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteRentalVehicleButton } from "@/components/admin/delete-rental-vehicle-button";
import { RentalStatusSelect } from "@/components/admin/rental-status-select";
import { getAllRentalVehiclesAdmin } from "@/lib/rentals/admin-queries";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kiralama Filosu",
  robots: { index: false, follow: false },
};

export default async function AdminRentalVehiclesPage() {
  const vehicles = await getAllRentalVehiclesAdmin();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kiralama Filosu</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {vehicles.length} kiralık araç kayıtlı
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/kiralama/new" />}>
          <PlusCircle className="h-4 w-4" />
          Yeni Kiralık Araç Ekle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz kiralık araç eklenmemiş.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Araç</TableHead>
                <TableHead>Yıl</TableHead>
                <TableHead>Günlük Fiyat</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => {
                const image = vehicle.images[0];
                const label = `${vehicle.brand} ${vehicle.model}`;
                return (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                          {image && (
                            <Image
                              src={image.url}
                              alt={label}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{formatPrice(vehicle.dailyPrice)}</TableCell>
                    <TableCell>
                      <RentalStatusSelect vehicleId={vehicle.id} status={vehicle.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Düzenle"
                          nativeButton={false}
                          render={<Link href={`/admin/kiralama/${vehicle.id}/edit`} />}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <DeleteRentalVehicleButton id={vehicle.id} label={label} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
