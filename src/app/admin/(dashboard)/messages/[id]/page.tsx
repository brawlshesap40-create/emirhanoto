import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { MessageResponseForm } from "@/components/admin/message-response-form";
import { getContactMessageById } from "@/lib/messages/queries";

export const metadata: Metadata = {
  title: "Mesaj",
  robots: { index: false, follow: false },
};

type Params = { id: string };

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const messageId = Number(id);
  if (!Number.isInteger(messageId)) notFound();

  const message = await getContactMessageById(messageId);
  if (!message) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{message.fullName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("tr-TR", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(message.createdAt)}{" "}
          tarihinde gönderildi
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              İletişim Bilgileri
            </h2>
            <dl className="space-y-2 text-sm">
              {message.phone && (
                <div className="flex items-center justify-between border-b border-border/60 py-2">
                  <dt className="text-muted-foreground">Telefon</dt>
                  <dd className="flex items-center gap-1.5 font-medium">
                    <Phone className="h-3.5 w-3.5" />
                    <a href={`tel:${message.phone}`} className="hover:underline">
                      {message.phone}
                    </a>
                  </dd>
                </div>
              )}
              {message.email && (
                <div className="flex items-center justify-between py-2">
                  <dt className="text-muted-foreground">E-posta</dt>
                  <dd className="flex items-center gap-1.5 font-medium">
                    <Mail className="h-3.5 w-3.5" />
                    <a href={`mailto:${message.email}`} className="hover:underline">
                      {message.email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Mesaj
            </h2>
            <p className="whitespace-pre-line text-sm">{message.message}</p>
          </div>
        </div>

        <MessageResponseForm
          id={message.id}
          initialStatus={message.status}
          initialAdminNote={message.adminNote}
        />
      </div>
    </div>
  );
}
