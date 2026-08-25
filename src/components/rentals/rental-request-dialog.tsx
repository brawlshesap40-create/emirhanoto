"use client";

import { useActionState, useState } from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  submitRentalRequestAction,
  type RentalRequestFormState,
} from "@/lib/rentals/requests-actions";

const initialState: RentalRequestFormState = { status: "idle" };

export function RentalRequestDialogTrigger({
  vehicleId,
  vehicleName,
}: {
  vehicleId: number;
  vehicleName: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(submitRentalRequestAction, initialState);

  return (
    <>
      <Button
        size="lg"
        className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
        onClick={() => setOpen(true)}
      >
        <CalendarClock className="h-4 w-4" />
        Kiralama Talebi Oluştur
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Kiralama Talebi</DialogTitle>
            <DialogDescription>
              {vehicleName} için kiralama tarihlerinizi ve iletişim bilgilerinizi bırakın,
              ekibimiz sizi arayarak müsaitliği teyit etsin.
            </DialogDescription>
          </DialogHeader>

          {state.status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <p className="text-sm font-medium">Talebiniz alındı.</p>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Kapat
              </Button>
            </div>
          ) : (
            <form action={action} className="space-y-3">
              <input type="hidden" name="rentalVehicleId" value={vehicleId} />
              <div className="space-y-1.5">
                <Label htmlFor="rr-fullName">Ad Soyad *</Label>
                <Input id="rr-fullName" name="fullName" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rr-phone">Telefon *</Label>
                <Input
                  id="rr-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="0555 000 00 00"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rr-email">E-posta</Label>
                <Input id="rr-email" name="email" type="email" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rr-startDate">Başlangıç Tarihi</Label>
                  <Input id="rr-startDate" name="startDate" type="date" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rr-endDate">Bitiş Tarihi</Label>
                  <Input id="rr-endDate" name="endDate" type="date" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rr-note">Not</Label>
                <Textarea
                  id="rr-note"
                  name="note"
                  rows={2}
                  placeholder="Teslim yeri, ek sürücü gibi tercihleriniz."
                />
              </div>
              {state.status === "error" && (
                <p className="text-sm text-destructive">{state.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Gönderiliyor..." : "Talebi Gönder"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
