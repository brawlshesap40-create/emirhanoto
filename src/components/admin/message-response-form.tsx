"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateContactMessageAction } from "@/lib/messages/actions";

type Status = "yeni" | "gorusuluyor" | "sonuclandi";

export function MessageResponseForm({
  id,
  initialStatus,
  initialAdminNote,
}: {
  id: number;
  initialStatus: Status;
  initialAdminNote: string | null;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [adminNote, setAdminNote] = useState(initialAdminNote ?? "");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateContactMessageAction(id, {
          status,
          adminNote: adminNote.trim() ? adminNote.trim() : null,
        });
        toast.success("Kaydedildi.");
      } catch {
        toast.error("Kaydedilirken bir hata oluştu.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Değerlendirme
      </h2>

      <div className="space-y-1.5">
        <Label htmlFor="status">Durum</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="yeni">Yeni</option>
          <option value="gorusuluyor">Görüşülüyor</option>
          <option value="sonuclandi">Sonuçlandı</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="adminNote">Not</Label>
        <Textarea
          id="adminNote"
          rows={4}
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          placeholder="Görüşme notları..."
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </Button>
    </form>
  );
}
