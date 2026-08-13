"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type GalleryImage = {
  url: string;
  altText: string | null;
};

const SWIPE_THRESHOLD = 50;

export function VehicleGallery({
  images,
  vehicleName,
}: {
  images: GalleryImage[];
  vehicleName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
        Görsel yok
      </div>
    );
  }

  const goTo = (index: number) => {
    setActiveIndex((index + images.length) % images.length);
  };

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      goTo(activeIndex + (deltaX < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  }

  const activeImage = images[activeIndex];

  return (
    <div>
      <div
        className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl bg-muted"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.altText ?? `${vehicleName} fotoğrafı ${activeIndex + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
          <Expand className="h-4 w-4" />
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Önceki fotoğraf"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Sonraki fotoğraf"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-md ring-2 ring-transparent",
                index === activeIndex && "ring-brand"
              )}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${vehicleName} küçük görsel ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="h-full max-h-none w-full max-w-none border-none bg-black/95 p-0 sm:rounded-none"
        >
          <DialogTitle className="sr-only">
            {vehicleName} fotoğraf galerisi
          </DialogTitle>
          <div
            className="relative flex h-full w-full items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <DialogClose className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </DialogClose>

            <div className="relative h-[70vh] w-[90vw]">
              <Image
                src={activeImage.url}
                alt={activeImage.altText ?? `${vehicleName} fotoğrafı ${activeIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Önceki fotoğraf"
                  onClick={() => goTo(activeIndex - 1)}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  aria-label="Sonraki fotoğraf"
                  onClick={() => goTo(activeIndex + 1)}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                  {activeIndex + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
