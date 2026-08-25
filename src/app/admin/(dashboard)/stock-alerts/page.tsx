import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllStockAlertSubscriptions } from "@/lib/stock-alerts/queries";
import { CATEGORY_LABELS } from "@/lib/vehicles/constants";

export const metadata: Metadata = {
  title: "Stok Bildirimleri",
  robots: { index: false, follow: false },
};

export default async function StockAlertsPage() {
  const subscriptions = await getAllStockAlertSubscriptions();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Stok Bildirim Talepleri</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {subscriptions.length} kayıt — aranan araç stoğa girince bu kişileri arayın.
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz stok bildirim talebi yok.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>E-posta</TableHead>
                <TableHead>Marka</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    <a href={`mailto:${sub.email}`} className="hover:underline">
                      {sub.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sub.brand || "Fark etmez"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sub.category ? CATEGORY_LABELS[sub.category] : "Fark etmez"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(sub.createdAt)}
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
