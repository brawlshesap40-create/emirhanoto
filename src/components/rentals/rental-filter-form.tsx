"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  RENTAL_CATEGORY_OPTIONS,
  RENTAL_FUEL_TYPES,
  RENTAL_TRANSMISSIONS,
} from "@/lib/rentals/constants";

type RawSearchParams = Record<string, string | string[] | undefined>;

type FormValues = {
  brand: string;
  category: string;
  minDailyPrice: string;
  maxDailyPrice: string;
  fuelType: string;
  transmission: string;
};

function readParam(searchParams: RawSearchParams, key: string) {
  const value = searchParams[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function selectClassName(hasValue: boolean) {
  return `h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
    hasValue ? "" : "text-muted-foreground"
  }`;
}

export function RentalFilterForm({
  brands,
  searchParams,
}: {
  brands: string[];
  searchParams: RawSearchParams;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    brand: readParam(searchParams, "brand"),
    category: readParam(searchParams, "category"),
    minDailyPrice: readParam(searchParams, "minDailyPrice"),
    maxDailyPrice: readParam(searchParams, "maxDailyPrice"),
    fuelType: readParam(searchParams, "fuelType"),
    transmission: readParam(searchParams, "transmission"),
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function apply() {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/kiralama${params.toString() ? `?${params}` : ""}`);
    setMobileOpen(false);
  }

  function clear() {
    setValues({
      brand: "",
      category: "",
      minDailyPrice: "",
      maxDailyPrice: "",
      fuelType: "",
      transmission: "",
    });
    router.push("/kiralama");
    setMobileOpen(false);
  }

  const activeCount = Object.values(values).filter(Boolean).length;

  const fields = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="rental-filter-brand">Marka</Label>
        <select
          id="rental-filter-brand"
          className={selectClassName(!!values.brand)}
          value={values.brand}
          onChange={(e) => update("brand", e.target.value)}
        >
          <option value="">Tüm Markalar</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rental-filter-category">Kategori</Label>
        <select
          id="rental-filter-category"
          className={selectClassName(!!values.category)}
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {RENTAL_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="rental-filter-min-price">Min. Günlük</Label>
          <Input
            id="rental-filter-min-price"
            type="number"
            inputMode="numeric"
            placeholder="1.000"
            value={values.minDailyPrice}
            onChange={(e) => update("minDailyPrice", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rental-filter-max-price">Maks. Günlük</Label>
          <Input
            id="rental-filter-max-price"
            type="number"
            inputMode="numeric"
            placeholder="10.000"
            value={values.maxDailyPrice}
            onChange={(e) => update("maxDailyPrice", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rental-filter-fuel">Yakıt</Label>
        <select
          id="rental-filter-fuel"
          className={selectClassName(!!values.fuelType)}
          value={values.fuelType}
          onChange={(e) => update("fuelType", e.target.value)}
        >
          <option value="">Tümü</option>
          {RENTAL_FUEL_TYPES.map((fuel) => (
            <option key={fuel} value={fuel}>
              {fuel}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rental-filter-transmission">Şanzıman</Label>
        <select
          id="rental-filter-transmission"
          className={selectClassName(!!values.transmission)}
          value={values.transmission}
          onChange={(e) => update("transmission", e.target.value)}
        >
          <option value="">Tümü</option>
          {RENTAL_TRANSMISSIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button className="flex-1" onClick={apply}>
          Filtrele
        </Button>
        <Button variant="outline" onClick={clear}>
          Temizle
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger render={<Button variant="outline" className="w-full" />}>
            <Filter className="h-4 w-4" />
            Filtrele
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-brand px-1.5 py-0.5 text-xs font-semibold text-brand-foreground">
                {activeCount}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Filtreler
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground"
                  aria-label="Kapat"
                >
                  <X className="h-4 w-4" />
                </button>
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4">{fields}</div>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden rounded-xl border border-border bg-card p-5 lg:block lg:h-fit">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Filtreler
        </h2>
        {fields}
      </aside>
    </>
  );
}
