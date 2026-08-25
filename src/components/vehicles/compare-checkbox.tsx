"use client";

import { Check, Scale } from "lucide-react";
import { useCompare } from "@/lib/compare/use-compare";
import { cn } from "@/lib/utils";

export function CompareCheckbox({
  vehicleId,
  className,
}: {
  vehicleId: number;
  className?: string;
}) {
  const { isSelected, toggle, ids, max } = useCompare();
  const active = isSelected(vehicleId);
  const disabled = !active && ids.length >= max;

  return (
    <button
      type="button"
      aria-label={active ? "Karşılaştırmadan çıkar" : "Karşılaştırmaya ekle"}
      aria-pressed={active}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(vehicleId);
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-brand text-brand-foreground hover:bg-brand/90",
        className
      )}
      title={disabled ? `En fazla ${max} araç karşılaştırılabilir` : "Karşılaştır"}
    >
      {active ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
    </button>
  );
}
