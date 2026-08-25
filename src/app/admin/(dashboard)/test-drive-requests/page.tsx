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
import { Badge } from "@/components/ui/badge";
import { getAllTestDriveRequests } from "@/lib/test-drive/queries";

export const metadata: Metadata = {
  title: "Test Sürüşü Talepleri",
  robots: { index: false, follow: false },
};

const STATUS_LABELS = {
  yeni: "Yeni",
  onaylandi: "Onaylandı",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
} as const;

const STATUS_VARIANT = {
  yeni: "default",
  onaylandi: "secondary",
  tamamlandi: "outline",
  iptal: "destructive",
} as const;

export default async function TestDriveRequestsPage() {
  const requests = await getAllTestDriveRequests();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Test Sürüşü Talepleri</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {requests.length} talep kayıtlı
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz test sürüşü talebi yok.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>Araç</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Tercih Edilen Tarih</TableHead>
                <TableHead>Talep Tarihi</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/admin/test-drive-requests/${request.id}`}
                      className="font-medium hover:underline"
                    >
                      {request.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/test-drive-requests/${request.id}`}>
                      {request.vehicle
                        ? `${request.vehicle.brand} ${request.vehicle.model} (${request.vehicle.year})`
                        : "—"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${request.phone}`} className="hover:underline">
                      {request.phone}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {request.preferredDate
                      ? new Intl.DateTimeFormat("tr-TR", {
                          dateStyle: "medium",
                        }).format(new Date(request.preferredDate))
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(request.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[request.status]}>
                      {STATUS_LABELS[request.status]}
                    </Badge>
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
