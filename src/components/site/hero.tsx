import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, buildWhatsAppUrl } from "@/lib/site-config";

const STATS = [
  { value: "36 Yıl", label: "Sektör Tecrübesi" },
  { value: "15+", label: "Güncel Araç Stoku" },
  { value: "750K - 5M ₺", label: "Fiyat Aralığı" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <Truck className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 text-background/5" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/5 px-3 py-1 text-xs font-medium text-background/80">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" />
          İstanbul / Bağcılar &middot; 1988&apos;den beri
        </div>

        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-brand">{siteConfig.slogan}</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-background/70 sm:text-lg">
          {siteConfig.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            size="lg"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            nativeButton={false}
            render={<Link href="/araclarimiz" />}
          >
            Araçlarımızı İncele
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
            nativeButton={false}
            render={
              <a
                href={buildWhatsAppUrl("Merhaba, aracımı değerletmek istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Aracımı Değerle
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-background hover:bg-background/10 hover:text-background"
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
            WhatsApp&apos;tan Ulaş
          </Button>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-background/10 pt-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="text-2xl font-bold sm:text-3xl">{stat.value}</dt>
              <dd className="mt-1 text-xs text-background/60 sm:text-sm">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
