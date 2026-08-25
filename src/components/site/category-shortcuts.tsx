import Link from "next/link";
import { Car, Mountain, Sparkles, Truck, TreePine, Warehouse } from "lucide-react";
import { CATEGORY_LABELS, type VehicleCategory } from "@/lib/vehicles/constants";
import { SectionHeading } from "@/components/site/section-heading";

const ICONS: Record<VehicleCategory, React.ComponentType<{ className?: string }>> = {
  cift_kabin_pickup: Truck,
  ticari: Warehouse,
  suv: Mountain,
  otomobil: Car,
  arazi: TreePine,
  premium: Sparkles,
};

export function CategoryShortcuts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <SectionHeading
        eyebrow="Kategoriler"
        title="Kategoriye Göre Gözat"
        description="İhtiyacınıza uygun segmenti seçin, ilgili araçları hemen görüntüleyin."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => {
          const Icon = ICONS[value as VehicleCategory];
          return (
            <Link
              key={value}
              href={`/araclarimiz?category=${value}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_20px_44px_-20px_rgba(0,0,0,0.35)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
