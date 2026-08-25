"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { buildWhatsAppUrl, siteConfig } from "@/lib/site-config";

export function WhatsAppFloatingButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 md:bottom-6 md:right-6"
    >
      {open && (
        <div className="flex flex-col items-end gap-2">
          <a
            href={siteConfig.phoneHref}
            className="flex items-center gap-3 rounded-full bg-white py-1 pr-1 pl-4 text-sm font-medium text-foreground shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95"
          >
            {siteConfig.phoneDisplay}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <Phone className="h-4 w-4" />
            </span>
          </a>
          <a
            href={buildWhatsAppUrl(
              "Merhaba, Emirhan Otomotiv hakkında bilgi almak istiyorum."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-full bg-white py-1 pr-1 pl-4 text-sm font-medium text-foreground shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95"
          >
            WhatsApp&apos;tan Yaz
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            </span>
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "İletişim seçeneklerini kapat" : "İletişim seçeneklerini aç"}
        aria-expanded={open}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 ring-1 ring-white/10 transition-transform hover:scale-105 active:scale-95"
      >
        {!open && (
          <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/60 animate-ping [animation-duration:2.5s] group-hover:hidden" />
        )}
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-7 w-7" fill="currentColor" strokeWidth={0} />
        )}
      </button>
    </div>
  );
}
