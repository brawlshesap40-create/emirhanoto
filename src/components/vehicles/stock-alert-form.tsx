"use client";

import { useActionState } from "react";
import { BellPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  submitStockAlertSubscriptionAction,
  type StockAlertFormState,
} from "@/lib/stock-alerts/actions";
import { CATEGORY_OPTIONS } from "@/lib/vehicles/constants";

const initialState: StockAlertFormState = { status: "idle" };

export function StockAlertForm() {
  const [state, action, pending] = useActionState(
    submitStockAlertSubscriptionAction,
    initialState
  );

  if (state.status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <p>Kaydınız alındı, uygun araç geldiğinde sizi bilgilendireceğiz.</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-end"
    >
      <div className="flex items-start gap-2 sm:w-56">
        <BellPlus className="mt-2 h-4 w-4 shrink-0 text-brand" />
        <div>
          <p className="text-sm font-semibold">Aradığınızı bulamadınız mı?</p>
          <p className="text-xs text-muted-foreground">
            Uygun araç stoğa girince haber verelim.
          </p>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="sa-email" className="text-xs">
            E-posta *
          </Label>
          <Input id="sa-email" name="email" type="email" required placeholder="ornek@mail.com" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sa-brand" className="text-xs">
            Marka
          </Label>
          <Input id="sa-brand" name="brand" placeholder="Örn. Toyota" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sa-category" className="text-xs">
            Kategori
          </Label>
          <select
            id="sa-category"
            name="category"
            defaultValue=""
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Fark etmez</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button type="submit" disabled={pending} className="sm:self-end">
        {pending ? "Kaydediliyor..." : "Haberdar Et"}
      </Button>
    </form>
  );
}
