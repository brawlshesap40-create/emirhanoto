import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/site-config";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={buildWhatsAppUrl(
        "Merhaba, Emirhan Otomotiv hakkında bilgi almak istiyorum."
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan yazın"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 ring-1 ring-white/10 transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/60 animate-ping [animation-duration:2.5s] group-hover:hidden" />
      <MessageCircle className="h-7 w-7" fill="currentColor" strokeWidth={0} />
    </a>
  );
}
