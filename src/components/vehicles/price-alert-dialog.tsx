"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { BellRing, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  submitPriceAlertRequestAction,
  type PriceAlertFormState,
} from "@/lib/price-alerts/actions";

const initialState: PriceAlertFormState = { status: "idle" };

export function PriceAlertDialogTrigger({
  vehicleId,
  vehicleName,
}: {
  vehicleId: number;
  vehicleName: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    submitPriceAlertRequestAction,
    initialState
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-brand"
      >
        <BellRing className="h-3.5 w-3.5" />
        Fiyatı düşerse haber ver
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Fiyat Alarmı Kur</DialogTitle>
            <DialogDescription>
              {vehicleName} fiyatında değişiklik olursa sizi arayalım.
            </DialogDescription>
          </DialogHeader>

          {state.status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <p className="text-sm font-medium">Fiyat alarmı kuruldu.</p>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Kapat
              </Button>
            </div>
          ) : (
            <form action={action} className="space-y-3">
              <input type="hidden" name="vehicleId" value={vehicleId} />
              <div className="space-y-1.5">
                <Label htmlFor="pa-fullName">Ad Soyad *</Label>
                <Input id="pa-fullName" name="fullName" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pa-phone">Telefon</Label>
                <Input id="pa-phone" name="phone" type="tel" placeholder="0555 000 00 00" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pa-email">E-posta</Label>
                <Input id="pa-email" name="email" type="email" />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="pa-kvkk" name="kvkkConsent" required className="mt-0.5" />
                <Label htmlFor="pa-kvkk" className="text-xs font-normal text-muted-foreground">
                  <Link href="/kvkk" target="_blank" className="underline hover:text-foreground">
                    KVKK Aydınlatma Metni
                  </Link>
                  &apos;ni okudum, kabul ediyorum. *
                </Label>
              </div>
              {state.status === "error" && (
                <p className="text-sm text-destructive">{state.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Kaydediliyor..." : "Alarm Kur"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
