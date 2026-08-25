import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValuationDialogTrigger } from "@/components/site/valuation-dialog";
import { siteConfig } from "@/lib/site-config";

const STATS = [
  { value: "36 Yıl", label: "Sektör Tecrübesi" },
  { value: "15+", label: "Güncel Araç Stoku" },
  { value: "750K - 5M ₺", label: "Fiyat Aralığı" },
];

export function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className="h-full w-full bg-black object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="w-full max-w-xl">
          <h1 className="text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl">
            {siteConfig.slogan}
          </h1>
          <p className="mt-5 text-base text-white/75 sm:text-lg">
            {siteConfig.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-brand text-brand-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--brand),transparent_50%),0_8px_24px_-8px_var(--brand)] hover:bg-brand/90"
              nativeButton={false}
              render={<Link href="/araclarimiz" />}
            >
              Araçlarımızı İncele
              <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
            </Button>
            <ValuationDialogTrigger
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Aracımı Değerle
            </ValuationDialogTrigger>
          </div>

          <dl className="mt-10 grid grid-cols-3 divide-x divide-white/20 border-t border-white/20 pt-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-4 first:pl-0">
                <dt className="text-xl font-bold tabular-nums text-white sm:text-2xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs text-white/60">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
