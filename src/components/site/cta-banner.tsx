import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl, siteConfig } from "@/lib/site-config";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 text-center sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 0%, transparent 45%), radial-gradient(circle at 85% 80%, white 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Hayalinizdeki Araca Bugün Kavuşun
          </h2>
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            Güncel stoğumuzu inceleyin veya ekibimizle doğrudan WhatsApp&apos;tan iletişime
            geçin — size en uygun aracı birlikte bulalım.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-foreground shadow-lg hover:bg-white/90"
              nativeButton={false}
              render={<Link href="/araclarimiz" />}
            >
              Araçlarımızı İncele
              <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              nativeButton={false}
              render={
                <a
                  href={buildWhatsAppUrl(
                    `Merhaba ${siteConfig.name}, araç seçimi konusunda bilgi almak istiyorum.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp&apos;tan Ulaş
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
