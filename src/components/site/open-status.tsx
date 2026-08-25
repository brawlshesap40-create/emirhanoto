"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function parseHours(range: string) {
  const [start, end] = range.split("-").map((part) => part.trim());
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + (m ?? 0);
  };
  return { start: toMinutes(start), end: toMinutes(end) };
}

export function OpenStatus({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    function check() {
      const { start, end } = parseHours(siteConfig.workingHours);
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setIsOpen(minutes >= start && minutes < end);
    }
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (isOpen === null) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        isOpen
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
          : "border-border bg-muted text-muted-foreground",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isOpen ? "bg-emerald-500" : "bg-muted-foreground"
        )}
      />
      {isOpen ? "Şu an açığız" : "Şu an kapalıyız"}
    </span>
  );
}
