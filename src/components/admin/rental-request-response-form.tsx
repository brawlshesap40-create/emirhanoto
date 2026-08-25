"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateRentalRequestAction } from "@/lib/rentals/requests-actions";

type Status = "yeni" | "gorusuluyor" | "sonuclandi";

export function RentalRequestResponseForm({
  id,
  initialStatus,
  adminNote,
}: {
  id: number;
  initialStatus: Status;
  adminNote: string | null;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateRentalRequestAction(id, { status, adminNote });
        toast.success("Kaydedildi.");
      } catch {
        toast.error("Kaydedilirken bir hata oluştu.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as Status)}
        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="yeni">Yeni</option>
        <option value="gorusuluyor">Görüşülüyor</option>
        <option value="sonuclandi">Sonuçlandı</option>
      </select>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "..." : "Kaydet"}
      </Button>
    </form>
  );
}
