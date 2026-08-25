import { Award, Handshake, ShieldCheck, Star } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

const ITEMS = [
  {
    icon: Award,
    title: "36 Yıllık Tecrübe",
    description: "1988'den bu yana İstanbul'da güvenilir otomotiv hizmeti.",
  },
  {
    icon: Star,
    title: "Çift Kabinde Öncü",
    description: "Pick-up ve ticari araç segmentinde uzmanlaşmış kadro.",
  },
  {
    icon: Handshake,
    title: "Güvenilir Alım Satım",
    description: "Şeffaf ekspertiz ve hasar bilgisiyle güvenli işlem.",
  },
  {
    icon: ShieldCheck,
    title: "Seçkin Araç Stoku",
    description: "Özenle seçilmiş, güncel ve kontrollü araç envanteri.",
  },
];

export function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <SectionHeading
        eyebrow="01 — Neden Biz"
        title="Neden Bizi Seçmelisiniz?"
        description="36 yıllık tecrübeyi şeffaflık ve güvenle birleştiren bir alım satım süreci."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, index) => (
          <div
            key={item.title}
            className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold tabular-nums text-muted-foreground/50">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
