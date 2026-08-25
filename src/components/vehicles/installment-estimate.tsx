"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { formatPrice } from "@/lib/format";

const TERMS = [12, 24, 36];
const ILLUSTRATIVE_MONTHLY_RATE = 0.035;

function estimateMonthlyPayment(price: number, months: number) {
  const principal = price * 0.8;
  const rate = ILLUSTRATIVE_MONTHLY_RATE;
  const payment = (principal * rate * Math.pow(1 + rate, months)) /
    (Math.pow(1 + rate, months) - 1);
  return Math.round(payment);
}

export function InstallmentEstimate({ price }: { price: number }) {
  const [months, setMonths] = useState(24);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4 text-brand" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Taksit Tahmini
        </h3>
      </div>

      <div className="mt-4 flex gap-2">
        {TERMS.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => setMonths(term)}
            className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              months === term
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {term} Ay
          </button>
        ))}
      </div>

      <p className="mt-4 text-2xl font-bold tabular-nums">
        {formatPrice(estimateMonthlyPayment(price, months))}
        <span className="ml-1 text-sm font-normal text-muted-foreground">/ay</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        %20 peşinat varsayımıyla hesaplanan yaklaşık tutardır; kesin taksit planı bankanıza göre
        değişir. Kredi ve taksit seçenekleri için bizimle iletişime geçin.
      </p>
    </div>
  );
}
