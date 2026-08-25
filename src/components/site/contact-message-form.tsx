"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submitContactMessageAction,
  type ContactMessageFormState,
} from "@/lib/messages/actions";

const initialState: ContactMessageFormState = { status: "idle" };

export function ContactMessageForm() {
  const [state, action, pending] = useActionState(
    submitContactMessageAction,
    initialState
  );

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        <p className="font-medium">Mesajınız alındı.</p>
        <p className="text-sm text-muted-foreground">
          Ekibimiz en kısa sürede size dönüş yapacak.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Mesaj Bırakın
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cm-fullName">Ad Soyad *</Label>
          <Input id="cm-fullName" name="fullName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cm-phone">Telefon</Label>
          <Input id="cm-phone" name="phone" type="tel" placeholder="0555 000 00 00" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cm-email">E-posta</Label>
        <Input id="cm-email" name="email" type="email" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cm-message">Mesajınız *</Label>
        <Textarea id="cm-message" name="message" rows={4} required />
      </div>
      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Gönderiliyor..." : "Mesaj Gönder"}
      </Button>
    </form>
  );
}
