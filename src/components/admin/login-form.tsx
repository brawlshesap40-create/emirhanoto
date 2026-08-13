"use client";

import { useActionState } from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground text-background">
          <Truck className="h-6 w-6" />
        </span>
        <h1 className="mt-3 text-lg font-bold">Emirhan Otomotiv</h1>
        <p className="text-sm text-muted-foreground">Yönetici Paneli Girişi</p>
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" name="email" type="email" required autoComplete="username" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </div>
  );
}
