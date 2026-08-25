"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Flag } from "lucide-react";
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
  submitListingIssueReportAction,
  type ListingIssueFormState,
} from "@/lib/listing-issues/actions";

const initialState: ListingIssueFormState = { status: "idle" };

export function ListingIssueDialogTrigger({ vehicleId }: { vehicleId: number }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    submitListingIssueReportAction,
    initialState
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <Flag className="h-3.5 w-3.5" />
        Bu ilanda bir sorun mu var?
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>İlanı Bildir</DialogTitle>
            <DialogDescription>
              Yanlış bilgi, hatalı fotoğraf veya başka bir sorun mu fark ettiniz? Bize
              bildirin, en kısa sürede düzeltelim.
            </DialogDescription>
          </DialogHeader>

          {state.status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <p className="text-sm font-medium">Bildiriminiz alındı, teşekkürler.</p>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Kapat
              </Button>
            </div>
          ) : (
            <form action={action} className="space-y-3">
              <input type="hidden" name="vehicleId" value={vehicleId} />
              <div className="space-y-1.5">
                <Label htmlFor="li-message">Sorun *</Label>
                <Textarea
                  id="li-message"
                  name="message"
                  rows={3}
                  required
                  placeholder="Örn. Fiyat bilgisi güncel değil gibi görünüyor."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="li-email">E-posta (opsiyonel)</Label>
                <Input id="li-email" name="email" type="email" />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="li-kvkk" name="kvkkConsent" required className="mt-0.5" />
                <Label htmlFor="li-kvkk" className="text-xs font-normal text-muted-foreground">
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
                {pending ? "Gönderiliyor..." : "Bildir"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
