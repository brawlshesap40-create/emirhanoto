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
import { CreditApplicationResponseForm } from "@/components/admin/credit-application-response-form";
import { getAllCreditApplications } from "@/lib/credit-applications/queries";

export const metadata: Metadata = {
  title: "Kredi Başvuruları",
  robots: { index: false, follow: false },
};

export default async function CreditApplicationsPage() {
  const applications = await getAllCreditApplications();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Kredi Ön Başvuruları</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {applications.length} başvuru kayıtlı
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz kredi ön başvurusu yok.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>Araç</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>Not</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.fullName}</TableCell>
                  <TableCell>
                    {application.vehicle ? (
                      <Link
                        href={`/araclarimiz/${application.vehicle.slug}`}
                        target="_blank"
                        className="hover:underline"
                      >
                        {application.vehicle.brand} {application.vehicle.model}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <a href={`tel:${application.phone}`} className="hover:underline">
                      {application.phone}
                    </a>
                  </TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    <span className="line-clamp-1">{application.note || "-"}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(application.createdAt)}
                  </TableCell>
                  <TableCell>
                    <CreditApplicationResponseForm
                      id={application.id}
                      initialStatus={application.status}
                      adminNote={application.adminNote}
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
