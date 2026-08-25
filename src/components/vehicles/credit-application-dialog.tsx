"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  submitCreditApplicationAction,
  type CreditApplicationFormState,
} from "@/lib/credit-applications/actions";

const initialState: CreditApplicationFormState = { status: "idle" };

export function CreditApplicationDialogTrigger({
  vehicleId,
  vehicleName,
}: {
  vehicleId?: number;
  vehicleName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    submitCreditApplicationAction,
    initialState
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/30 hover:text-brand"
      >
        <Landmark className="h-4 w-4" />
        Kredi Ön Başvurusu Yap
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Kredi Ön Başvurusu</DialogTitle>
            <DialogDescription>
              {vehicleName ? `${vehicleName} için` : "Araç kredisi için"} bilgilerinizi
              bırakın, ekibimiz sizi arayarak güncel oranları ve seçenekleri paylaşsın. Bu
              bir kredi onayı değil, ön görüşme talebidir.
            </DialogDescription>
          </DialogHeader>

          {state.status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <p className="text-sm font-medium">Başvurunuz alındı.</p>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Kapat
              </Button>
            </div>
          ) : (
            <form action={action} className="space-y-3">
              {vehicleId && <input type="hidden" name="vehicleId" value={vehicleId} />}
              <div className="space-y-1.5">
                <Label htmlFor="ca-fullName">Ad Soyad *</Label>
                <Input id="ca-fullName" name="fullName" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ca-phone">Telefon *</Label>
                <Input
                  id="ca-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="0555 000 00 00"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ca-email">E-posta</Label>
                <Input id="ca-email" name="email" type="email" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ca-note">Not</Label>
                <Textarea
                  id="ca-note"
                  name="note"
                  rows={2}
                  placeholder="Peşinat, vade gibi tercihleriniz."
                />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="ca-kvkk" name="kvkkConsent" required className="mt-0.5" />
                <Label htmlFor="ca-kvkk" className="text-xs font-normal text-muted-foreground">
                  <Link href="/kvkk" target="_blank" className="underline hover:text-foreground">
                    KVKK Aydınlatma Metni
                  </Link>
                  &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum. *
                </Label>
              </div>
              {state.status === "error" && (
                <p className="text-sm text-destructive">{state.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
