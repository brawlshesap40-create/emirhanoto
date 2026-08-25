import Link from "next/link";
import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RentalRequestResponseForm } from "@/components/admin/rental-request-response-form";
import { getAllRentalRequests } from "@/lib/rentals/requests-queries";

export const metadata: Metadata = {
  title: "Kiralama Talepleri",
  robots: { index: false, follow: false },
};

function formatDateRange(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) return "—";
  return `${startDate ?? "?"} – ${endDate ?? "?"}`;
}

export default async function RentalRequestsPage() {
  const requests = await getAllRentalRequests();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Kiralama Talepleri</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {requests.length} talep kayıtlı
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz kiralama talebi yok.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>Araç</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>Tarih Aralığı</TableHead>
                <TableHead>Talep Tarihi</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.fullName}</TableCell>
                  <TableCell>
                    {request.rentalVehicle ? (
                      <Link
                        href={`/kiralama/${request.rentalVehicle.slug}`}
                        target="_blank"
                        className="hover:underline"
                      >
                        {request.rentalVehicle.brand} {request.rentalVehicle.model}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <a href={`tel:${request.phone}`} className="hover:underline">
                      {request.phone}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateRange(request.startDate, request.endDate)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(request.createdAt)}
                  </TableCell>
                  <TableCell>
                    <RentalRequestResponseForm
                      id={request.id}
                      initialStatus={request.status}
                      adminNote={request.adminNote}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
