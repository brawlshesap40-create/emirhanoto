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
  submitTestDriveRequestAction,
  type TestDriveFormState,
} from "@/lib/test-drive/actions";

const initialState: TestDriveFormState = { status: "idle" };

const TIME_SLOTS = ["09:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00", "15:00 - 17:00", "17:00 - 19:00"];

export function TestDriveDialogTrigger({
  vehicleId,
  vehicleName,
  className,
  size,
  variant,
  children,
}: {
  vehicleId: number;
  vehicleName: string;
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    submitTestDriveRequestAction,
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
            <DialogTitle>Test Sürüşü Başvurusu</DialogTitle>
            <DialogDescription>
              {vehicleName} için test sürüşü talebinde bulunun, ekibimiz sizi arayarak
              randevunuzu onaylasın.
            </DialogDescription>
          </DialogHeader>

          {state.status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              <p className="font-medium">Test sürüşü başvurunuz başarıyla alındı.</p>
              <p className="text-sm text-muted-foreground">
                Ekibimiz en kısa sürede sizinle iletişime geçecek.
              </p>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Kapat
              </Button>
            </div>
          ) : (
            <form action={action} className="space-y-4">
              <input type="hidden" name="vehicleId" value={vehicleId} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="td-fullName">Ad Soyad *</Label>
                  <Input id="td-fullName" name="fullName" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="td-phone">Telefon *</Label>
                  <Input
                    id="td-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="0555 000 00 00"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="td-email">E-posta</Label>
                <Input id="td-email" name="email" type="email" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="td-preferredDate">Tercih Edilen Tarih</Label>
                  <Input id="td-preferredDate" name="preferredDate" type="date" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="td-preferredTimeSlot">Tercih Edilen Saat</Label>
                  <select
                    id="td-preferredTimeSlot"
                    name="preferredTimeSlot"
                    defaultValue=""
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Fark etmez</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="td-viaVideoCall" name="viaVideoCall" />
                <Label htmlFor="td-viaVideoCall" className="font-normal">
                  Yerinde gelemiyorum, video görüşme ile araç tanıtımı istiyorum
                </Label>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="td-note">Not</Label>
                <Textarea
                  id="td-note"
                  name="note"
                  rows={3}
                  placeholder="Uygun olduğunuz saat aralığı gibi eklemek istediğiniz bilgiler."
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="td-kvkk" name="kvkkConsent" required className="mt-0.5" />
                <Label htmlFor="td-kvkk" className="text-xs font-normal text-muted-foreground">
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
                {pending ? "Gönderiliyor..." : "Test Sürüşü Talebi Gönder"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
