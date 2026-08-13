import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, buildWhatsAppUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${siteConfig.name} ile iletişime geçin - ${siteConfig.address}`,
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(`${siteConfig.name}, ${siteConfig.address}`);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">İletişim</h1>
        <p className="mt-3 text-muted-foreground">
          Sorularınız için bize ulaşın, size en kısa sürede geri dönelim.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-sm font-semibold">Adres</p>
                  <p className="text-sm text-muted-foreground">
                    {siteConfig.address}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-sm font-semibold">Telefon / WhatsApp</p>
                  <a
                    href={siteConfig.phoneHref}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-sm font-semibold">E-posta</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-sm font-semibold">Çalışma Saatleri</p>
                  <p className="text-sm text-muted-foreground">
                    Her gün {siteConfig.workingHours}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="bg-brand text-brand-foreground hover:bg-brand/90"
              nativeButton={false}
              render={
                <a
                  href={buildWhatsAppUrl(
                    "Merhaba, Emirhan Otomotiv hakkında bilgi almak istiyorum."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              WhatsApp&apos;tan Yazın
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              Google Maps&apos;te Görüntüle
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            title="Emirhan Otomotiv konum haritası"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-80 w-full lg:h-full lg:min-h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
