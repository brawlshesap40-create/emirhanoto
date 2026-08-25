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
import { ListingIssueResolveButton } from "@/components/admin/listing-issue-resolve-button";
import { getAllListingIssueReports } from "@/lib/listing-issues/queries";

export const metadata: Metadata = {
  title: "İlan Bildirimleri",
  robots: { index: false, follow: false },
};

export default async function ListingIssuesPage() {
  const reports = await getAllListingIssueReports();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">İlan Bildirimleri</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {reports.length} bildirim kayıtlı
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz ilan bildirimi yok.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Araç</TableHead>
                <TableHead>Sorun</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {report.vehicle ? (
                      <Link
                        href={`/araclarimiz/${report.vehicle.slug}`}
                        target="_blank"
                        className="font-medium hover:underline"
                      >
                        {report.vehicle.brand} {report.vehicle.model}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="max-w-sm text-sm">
                    <span className="line-clamp-2">{report.message}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {report.email || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(report.createdAt)}
                  </TableCell>
                  <TableCell>
                    <ListingIssueResolveButton id={report.id} resolved={report.resolved} />
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
