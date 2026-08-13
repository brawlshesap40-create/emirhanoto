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
  BODY_TYPES,
  CATEGORY_OPTIONS,
  FUEL_TYPES,
  TRANSMISSIONS,
} from "@/lib/vehicles/constants";

type RawSearchParams = Record<string, string | string[] | undefined>;

type FormValues = {
  brand: string;
  model: string;
  minPrice: string;
  maxPrice: string;
  year: string;
  maxMileage: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  category: string;
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

export function VehicleFilterForm({
  brands,
  searchParams,
}: {
  brands: string[];
  searchParams: RawSearchParams;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    brand: readParam(searchParams, "brand"),
    model: readParam(searchParams, "model"),
    minPrice: readParam(searchParams, "minPrice"),
    maxPrice: readParam(searchParams, "maxPrice"),
    year: readParam(searchParams, "year"),
    maxMileage: readParam(searchParams, "maxMileage"),
    fuelType: readParam(searchParams, "fuelType"),
    transmission: readParam(searchParams, "transmission"),
    bodyType: readParam(searchParams, "bodyType"),
    category: readParam(searchParams, "category"),
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
    router.push(`/araclarimiz${params.toString() ? `?${params}` : ""}`);
    setMobileOpen(false);
  }

  function clear() {
    setValues({
      brand: "",
      model: "",
      minPrice: "",
      maxPrice: "",
      year: "",
      maxMileage: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      category: "",
    });
    router.push("/araclarimiz");
    setMobileOpen(false);
  }

  const activeCount = Object.values(values).filter(Boolean).length;

  const fields = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="filter-brand">Marka</Label>
        <select
          id="filter-brand"
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
        <Label htmlFor="filter-model">Model</Label>
        <Input
          id="filter-model"
          placeholder="Örn. Hilux"
          value={values.model}
          onChange={(e) => update("model", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-category">Kategori</Label>
        <select
          id="filter-category"
          className={selectClassName(!!values.category)}
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="filter-min-price">Min. Fiyat</Label>
          <Input
            id="filter-min-price"
            type="number"
            inputMode="numeric"
            placeholder="750.000"
            value={values.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-max-price">Maks. Fiyat</Label>
          <Input
            id="filter-max-price"
            type="number"
            inputMode="numeric"
            placeholder="5.000.000"
            value={values.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="filter-year">Model Yılı</Label>
          <Input
            id="filter-year"
            type="number"
            inputMode="numeric"
            placeholder="2020"
            value={values.year}
            onChange={(e) => update("year", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-max-mileage">Azami Km</Label>
          <Input
            id="filter-max-mileage"
            type="number"
            inputMode="numeric"
            placeholder="150.000"
            value={values.maxMileage}
            onChange={(e) => update("maxMileage", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-fuel">Yakıt</Label>
        <select
          id="filter-fuel"
          className={selectClassName(!!values.fuelType)}
          value={values.fuelType}
          onChange={(e) => update("fuelType", e.target.value)}
        >
          <option value="">Tümü</option>
          {FUEL_TYPES.map((fuel) => (
            <option key={fuel} value={fuel}>
              {fuel}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-transmission">Şanzıman</Label>
        <select
          id="filter-transmission"
          className={selectClassName(!!values.transmission)}
          value={values.transmission}
          onChange={(e) => update("transmission", e.target.value)}
        >
          <option value="">Tümü</option>
          {TRANSMISSIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-body">Kasa Tipi</Label>
        <select
          id="filter-body"
          className={selectClassName(!!values.bodyType)}
          value={values.bodyType}
          onChange={(e) => update("bodyType", e.target.value)}
        >
          <option value="">Tümü</option>
          {BODY_TYPES.map((item) => (
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
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Filtreler
        </h2>
        {fields}
      </aside>
    </>
  );
}
