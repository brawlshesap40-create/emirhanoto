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
import { getAllContactMessages } from "@/lib/messages/queries";

export const metadata: Metadata = {
  title: "Mesajlar",
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

export default async function MessagesPage() {
  const messages = await getAllContactMessages();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mesajlar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages.length} mesaj kayıtlı
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz mesaj yok.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gönderen</TableHead>
                <TableHead>Mesaj</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/admin/messages/${message.id}`}
                      className="font-medium hover:underline"
                    >
                      {message.fullName}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <Link href={`/admin/messages/${message.id}`} className="line-clamp-1">
                      {message.message}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {message.phone || message.email || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(message.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[message.status]}>
                      {STATUS_LABELS[message.status]}
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
