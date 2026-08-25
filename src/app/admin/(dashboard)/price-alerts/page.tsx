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
import { PriceAlertNotifyButton } from "@/components/admin/price-alert-notify-button";
import { getAllPriceAlertRequests } from "@/lib/price-alerts/queries";

export const metadata: Metadata = {
  title: "Fiyat Alarmları",
  robots: { index: false, follow: false },
};

export default async function PriceAlertsPage() {
  const alerts = await getAllPriceAlertRequests();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Fiyat Alarmları</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {alerts.length} talep kayıtlı
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz fiyat alarmı talebi yok.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>Araç</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.fullName}</TableCell>
                  <TableCell>
                    {alert.vehicle ? (
                      <Link
                        href={`/araclarimiz/${alert.vehicle.slug}`}
                        target="_blank"
                        className="hover:underline"
                      >
                        {alert.vehicle.brand} {alert.vehicle.model}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {alert.phone || alert.email || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(alert.createdAt)}
                  </TableCell>
                  <TableCell>
                    <PriceAlertNotifyButton id={alert.id} notified={alert.notified} />
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
