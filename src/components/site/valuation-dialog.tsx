"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
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
  submitValuationRequestAction,
  type ValuationFormState,
} from "@/lib/valuation/actions";

const initialState: ValuationFormState = { status: "idle" };

export function ValuationDialogTrigger({
  className,
  size,
  variant,
  children,
}: {
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    submitValuationRequestAction,
    initialState
  );

  return (
    <>
      <Button className={className} size={size} variant={variant} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Aracımı Değerle</DialogTitle>
            <DialogDescription>
              Araç bilgilerinizi ve telefon numaranızı bırakın, ekibimiz en kısa sürede
              sizi arayarak aracınızı değerlendirsin.
            </DialogDescription>
          </DialogHeader>

          {state.status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              <p className="font-medium">Değerleme talebiniz başarıyla alındı.</p>
              <p className="text-sm text-muted-foreground">
                Ekibimiz en kısa sürede sizinle iletişime geçecek.
              </p>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Kapat
              </Button>
            </div>
          ) : (
            <form action={action} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="val-fullName">Ad Soyad *</Label>
                  <Input id="val-fullName" name="fullName" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="val-phone">Telefon *</Label>
                  <Input
                    id="val-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="0555 000 00 00"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="val-email">E-posta</Label>
                <Input id="val-email" name="email" type="email" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="val-brand">Marka *</Label>
                  <Input id="val-brand" name="brand" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="val-model">Model *</Label>
                  <Input id="val-model" name="model" required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="val-year">Model Yılı *</Label>
                  <Input id="val-year" name="year" type="number" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="val-mileage">Kilometre *</Label>
                  <Input id="val-mileage" name="mileage" type="number" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="val-description">Araç Durumu / Açıklama</Label>
                <Textarea
                  id="val-description"
                  name="description"
                  rows={3}
                  placeholder="Ekspertiz, hasar, değişen parça gibi bilgileri buraya yazabilirsiniz."
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="val-kvkk" name="kvkkConsent" required className="mt-0.5" />
                <Label htmlFor="val-kvkk" className="text-xs font-normal text-muted-foreground">
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
                {pending ? "Gönderiliyor..." : "Değerleme Talebi Gönder"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Bu bir ön değerleme talebidir; kesin fiyat teklifi ekibimiz sizinle
                görüştükten sonra iletilir.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
