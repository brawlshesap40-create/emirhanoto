import { PRIORITY_BRANDS } from "@/lib/vehicles/constants";

const BRAND_LOGOS: Record<string, string> = {
  Toyota: "https://www.carlogos.org/car-logos/toyota-logo.png",
  Isuzu: "https://www.carlogos.org/car-logos/isuzu-logo.png",
  Ford: "https://www.carlogos.org/car-logos/ford-logo.png",
  Mitsubishi: "https://www.carlogos.org/car-logos/mitsubishi-logo.png",
  Volkswagen: "https://www.carlogos.org/car-logos/volkswagen-logo.png",
  Renault: "https://www.carlogos.org/car-logos/renault-logo.png",
};

const BRANDS = [...PRIORITY_BRANDS, ...PRIORITY_BRANDS];

export function BrandStrip() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-muted/40 py-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage:
          "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div className="relative flex items-center justify-center gap-3">
        <span className="hairline-gradient w-10" />
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Öncelikli Çalıştığımız Markalar
        </p>
        <span className="hairline-gradient w-10" />
      </div>
      <div className="relative mt-7 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-muted/40 to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-muted/40 to-transparent sm:w-28" />
        <div className="flex w-max animate-marquee items-center">
          {BRANDS.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="group mx-3 flex h-16 w-32 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md sm:h-20 sm:w-40"
            >
              <img
                src={BRAND_LOGOS[brand]}
                alt={brand}
                className="h-8 w-auto object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:h-10"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
