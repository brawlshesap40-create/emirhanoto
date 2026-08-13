import {
  ClipboardCheck,
  Handshake,
  KeySquare,
  Repeat,
  Search,
  Wrench,
} from "lucide-react";

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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Hizmetlerimiz
        </h2>
        <p className="mt-2 text-muted-foreground">
          Araç alım satımının her aşamasında yanınızdayız.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <div
            key={service.title}
            className="flex gap-4 rounded-xl border border-border bg-card p-6"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
              <service.icon className="h-5 w-5" />
            </span>
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
