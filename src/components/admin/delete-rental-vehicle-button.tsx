"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteRentalVehicleAction } from "@/lib/rentals/actions";

export function DeleteRentalVehicleButton({ id, label }: { id: number; label: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteRentalVehicleAction(id);
        toast.success("Araç silindi.");
        setOpen(false);
      } catch {
        toast.error("Araç silinirken bir hata oluştu.");
      }
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive"
        aria-label="Aracı sil"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aracı Sil</DialogTitle>
            <DialogDescription>
              &quot;{label}&quot; aracını silmek istediğinize emin misiniz? Bu işlem geri
              alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              {pending ? "Siliniyor..." : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
