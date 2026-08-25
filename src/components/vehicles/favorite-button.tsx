"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites/use-favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  vehicleId,
  className,
}: {
  vehicleId: number;
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(vehicleId);

  return (
    <button
      type="button"
      aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(vehicleId);
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background",
        className
      )}
    >
      <Heart
        className={cn("h-4 w-4", active && "fill-brand text-brand")}
      />
    </button>
  );
}
