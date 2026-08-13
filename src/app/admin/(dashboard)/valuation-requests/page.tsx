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
import { getAllValuationRequests } from "@/lib/valuation/queries";
import { formatMileage, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Değerleme Talepleri",
  robots: { index: false, follow: false },
};

const STATUS_LABELS = {
  yeni: "Yeni",
  gorusuluyor: "Görüşülüyor",
  sonuclandi: "Sonuçlandı",
} as const;

const STATUS_VARIANT = {
  yeni: "default",
  gorusuluyor: "secondary",
  sonuclandi: "outline",
} as const;

export default async function ValuationRequestsPage() {
  const requests = await getAllValuationRequests();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Değerleme Talepleri</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {requests.length} talep kayıtlı
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz değerleme talebi yok.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>Araç</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Teklif</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/admin/valuation-requests/${request.id}`}
                      className="font-medium hover:underline"
                    >
                      {request.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/valuation-requests/${request.id}`}>
                      {request.brand} {request.model} ({request.year})
                      <span className="block text-xs text-muted-foreground">
                        {formatMileage(request.mileage)}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${request.phone}`} className="hover:underline">
                      {request.phone}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(request.createdAt)}
                  </TableCell>
                  <TableCell>
                    {request.offeredPrice != null
                      ? formatPrice(request.offeredPrice)
                      : "-"}
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
