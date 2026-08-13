import { PRIORITY_BRANDS } from "@/lib/vehicles/constants";

export function BrandStrip() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Öncelikli Çalıştığımız Markalar
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PRIORITY_BRANDS.map((brand) => (
            <span
              key={brand}
              className="text-lg font-bold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground sm:text-xl"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
