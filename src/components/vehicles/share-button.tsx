"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/site-config";

export function ShareButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // kullanıcı paylaşımı iptal etti, WhatsApp'a düş
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    window.open(buildWhatsAppUrl(`${title} - ${url}`), "_blank", "noopener,noreferrer");
  }

  return (
    <Button type="button" variant="outline" size="icon" onClick={handleShare} aria-label="Paylaş">
      {copied ? <Check className="h-4 w-4 text-brand" /> : <Share2 className="h-4 w-4" />}
    </Button>
  );
}
