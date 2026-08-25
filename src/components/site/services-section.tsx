import {
  ClipboardCheck,
  Handshake,
  KeySquare,
  Repeat,
  Search,
  Wrench,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

const SERVICES = [
  { icon: KeySquare, title: "Araç Alımı", description: "İkinci el aracınızı adil ve hızlı şekilde değerinde satın alıyoruz." },
  { icon: Handshake, title: "Araç Satışı", description: "Kontrollü, ekspertizli araçları güvenle sizinle buluşturuyoruz." },
  { icon: Repeat, title: "Takas", description: "Mevcut aracınızı takas ederek yeni aracınıza kolayca geçin." },
  { icon: Search, title: "Araç Değerleme", description: "Aracınızın güncel piyasa değerini uzman ekibimizle belirliyoruz." },
  { icon: ClipboardCheck, title: "Ekspertiz", description: "Motor, şanzıman, kaporta ve boya durumunu detaylıca raporluyoruz." },
  { icon: Wrench, title: "Test Sürüşü", description: "Karar vermeden önce aracı yerinde deneyimleme imkanı sunuyoruz." },
];

export function ServicesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <SectionHeading
        eyebrow="03 — Hizmetlerimiz"
        title="Uçtan uca araç danışmanlığı"
        description="Araç alım satımının her aşamasında yanınızdayız."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <div
            key={service.title}
            className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground">
                <service.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold tabular-nums text-muted-foreground/50">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold">{service.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
