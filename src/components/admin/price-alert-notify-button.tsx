"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markPriceAlertNotifiedAction } from "@/lib/price-alerts/actions";

export function PriceAlertNotifyButton({
  id,
  notified,
}: {
  id: number;
  notified: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (notified) {
    return <span className="text-xs text-muted-foreground">Bildirildi</span>;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await markPriceAlertNotifiedAction(id);
            toast.success("İşaretlendi.");
          } catch {
            toast.error("Bir hata oluştu.");
          }
        })
      }
    >
      {pending ? "Kaydediliyor..." : "Bildirildi Olarak İşaretle"}
    </Button>
  );
}
