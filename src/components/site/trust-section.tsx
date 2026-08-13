import { Award, Handshake, ShieldCheck, Star } from "lucide-react";

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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/15 text-brand">
              <item.icon className="h-5 w-5" />
            </span>
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
