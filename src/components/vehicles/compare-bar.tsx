"use client";

import Link from "next/link";
import { Scale, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/lib/compare/use-compare";

export function CompareBar() {
  const { ids, clear, max } = useCompare();

  if (ids.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md sm:bottom-4 sm:left-1/2 sm:inset-x-auto sm:-translate-x-1/2 sm:rounded-full sm:border sm:px-5 sm:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)]">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 sm:mx-0">
        <div className="flex items-center gap-2 text-sm">
          <Scale className="h-4 w-4 text-brand" />
          <span className="font-medium">
            {ids.length} / {max} araç seçildi
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            aria-label="Seçimi temizle"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <Button
            size="sm"
            disabled={ids.length < 2}
            nativeButton={false}
            render={<Link href={`/araclarimiz/karsilastir?ids=${ids.join(",")}`} />}
          >
            Karşılaştır
          </Button>
        </div>
      </div>
    </div>
  );
}
