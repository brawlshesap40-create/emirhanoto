import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { ValuationResponseForm } from "@/components/admin/valuation-response-form";
import { getValuationRequestById } from "@/lib/valuation/queries";
import { formatMileage } from "@/lib/format";

export const metadata: Metadata = {
  title: "Değerleme Talebi",
  robots: { index: false, follow: false },
};

type Params = { id: string };

export default async function ValuationRequestDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const requestId = Number(id);
  if (!Number.isInteger(requestId)) notFound();

  const request = await getValuationRequestById(requestId);
  if (!request) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {request.brand} {request.model} ({request.year})
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("tr-TR", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(request.createdAt)}{" "}
          tarihinde gönderildi
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Müşteri Bilgileri
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between border-b border-border/60 py-2">
                <dt className="text-muted-foreground">Ad Soyad</dt>
                <dd className="font-medium">{request.fullName}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 py-2">
                <dt className="text-muted-foreground">Telefon</dt>
                <dd className="flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5" />
                  <a href={`tel:${request.phone}`} className="hover:underline">
                    {request.phone}
                  </a>
                </dd>
              </div>
              {request.email && (
                <div className="flex items-center justify-between py-2">
                  <dt className="text-muted-foreground">E-posta</dt>
                  <dd className="flex items-center gap-1.5 font-medium">
                    <Mail className="h-3.5 w-3.5" />
                    <a href={`mailto:${request.email}`} className="hover:underline">
                      {request.email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Araç Bilgileri
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between border-b border-border/60 py-2">
                <dt className="text-muted-foreground">Marka / Model</dt>
                <dd className="font-medium">
                  {request.brand} {request.model}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 py-2">
                <dt className="text-muted-foreground">Model Yılı</dt>
                <dd className="font-medium">{request.year}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">Kilometre</dt>
                <dd className="font-medium">{formatMileage(request.mileage)}</dd>
              </div>
            </dl>
            {request.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Araç Durumu / Açıklama
                </p>
                <p className="mt-1 whitespace-pre-line text-sm">{request.description}</p>
              </div>
            )}
          </div>
        </div>

        <ValuationResponseForm
          id={request.id}
          initialStatus={request.status}
          initialOfferedPrice={request.offeredPrice}
          initialAdminNote={request.adminNote}
        />
      </div>
    </div>
  );
}
