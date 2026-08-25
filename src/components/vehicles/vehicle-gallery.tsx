"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Video, X } from "lucide-react";
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
  category?: string | null;
};

const SWIPE_THRESHOLD = 50;

const CATEGORY_TABS: { value: string; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "dis", label: "Dış" },
  { value: "ic", label: "İç" },
  { value: "motor", label: "Motor" },
];

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function VehicleGallery({
  images,
  vehicleName,
  videoUrl,
}: {
  images: GalleryImage[];
  vehicleName: string;
  videoUrl?: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const touchStartX = useRef<number | null>(null);

  const availableCategories = useMemo(
    () => new Set(images.map((image) => image.category).filter(Boolean)),
    [images]
  );
  const showTabs = availableCategories.size > 0 || Boolean(videoUrl);

  const filteredImages = useMemo(
    () =>
      activeTab === "all" || activeTab === "video"
        ? images
        : images.filter((image) => image.category === activeTab),
    [images, activeTab]
  );

  const embedUrl = videoUrl ? getYoutubeEmbedUrl(videoUrl) : null;

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
        Görsel yok
      </div>
    );
  }

  const goTo = (index: number) => {
    setActiveIndex((index + filteredImages.length) % filteredImages.length);
  };

  function selectTab(tab: string) {
    setActiveTab(tab);
    setActiveIndex(0);
  }

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

  const activeImage = filteredImages[activeIndex] ?? filteredImages[0];

  return (
    <div>
      {showTabs && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {CATEGORY_TABS.filter(
            (tab) => tab.value === "all" || availableCategories.has(tab.value)
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => selectTab(tab.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeTab === tab.value
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
          {embedUrl && (
            <button
              type="button"
              onClick={() => selectTab("video")}
              className={cn(
                "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeTab === "video"
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <Video className="h-3 w-3" />
              Video
            </button>
          )}
        </div>
      )}

      {activeTab === "video" && embedUrl ? (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-black">
          <iframe
            src={embedUrl}
            title={`${vehicleName} tanıtım videosu`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border border-border bg-muted"
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
          {filteredImages.length > 1 && (
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
                {activeIndex + 1} / {filteredImages.length}
              </span>
            </>
          )}
        </div>
      )}

      {activeTab !== "video" && filteredImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {filteredImages.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-md ring-2 ring-transparent transition-all duration-200 hover:ring-brand/40",
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

            {filteredImages.length > 1 && (
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
                  {activeIndex + 1} / {filteredImages.length}
                </span>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
