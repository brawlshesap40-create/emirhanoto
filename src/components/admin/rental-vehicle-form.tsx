"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";
import {
  createRentalVehicleAction,
  updateRentalVehicleAction,
} from "@/lib/rentals/actions";
import type { RentalVehicleInput } from "@/lib/validation/rental-vehicle";
import {
  RENTAL_CATEGORY_OPTIONS,
  RENTAL_FEATURE_OPTIONS,
  RENTAL_FUEL_TYPES,
  RENTAL_STATUS_OPTIONS,
  RENTAL_TRANSMISSIONS,
  type RentalVehicleCategory,
  type RentalVehicleStatus,
} from "@/lib/rentals/constants";

type FormState = {
  brand: string;
  model: string;
  year: string;
  category: RentalVehicleCategory | "";
  transmission: string;
  fuelType: string;
  seatCount: string;
  doorCount: string;
  color: string;
  dailyPrice: string;
  weeklyPrice: string;
  monthlyPrice: string;
  deposit: string;
  minRentalDays: string;
  description: string;
  status: RentalVehicleStatus;
  isFeatured: boolean;
  features: string[];
  images: UploadedImage[];
};

const EMPTY_STATE: FormState = {
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  category: "",
  transmission: "",
  fuelType: "",
  seatCount: "",
  doorCount: "",
  color: "",
  dailyPrice: "",
  weeklyPrice: "",
  monthlyPrice: "",
  deposit: "",
  minRentalDays: "1",
  description: "",
  status: "musait",
  isFeatured: false,
  features: [],
  images: [],
};

function selectClassName() {
  return "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
}

export function RentalVehicleForm({
  vehicleId,
  defaultValues,
}: {
  vehicleId?: number;
  defaultValues?: Partial<FormState>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({
    ...EMPTY_STATE,
    ...defaultValues,
  });
  const [customFeature, setCustomFeature] = useState("");
  const [pending, startTransition] = useTransition();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFeature(label: string) {
    setValues((prev) => ({
      ...prev,
      features: prev.features.includes(label)
        ? prev.features.filter((f) => f !== label)
        : [...prev.features, label],
    }));
  }

  function addCustomFeature() {
    const label = customFeature.trim();
    if (!label || values.features.includes(label)) return;
    update("features", [...values.features, label]);
    setCustomFeature("");
  }

  function validate(): string | null {
    if (!values.brand.trim()) return "Marka zorunludur.";
    if (!values.model.trim()) return "Model zorunludur.";
    if (!values.category) return "Kategori seçiniz.";
    if (!values.year || Number.isNaN(Number(values.year))) return "Model yılı geçersiz.";
    if (!values.dailyPrice || Number.isNaN(Number(values.dailyPrice)))
      return "Günlük fiyat geçersiz.";
    if (!values.minRentalDays || Number.isNaN(Number(values.minRentalDays)))
      return "Minimum kiralama süresi geçersiz.";
    if (values.images.length === 0) return "En az 1 fotoğraf ekleyin.";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const nullIfEmpty = (value: string) => (value.trim() ? value.trim() : null);

    const input: RentalVehicleInput = {
      brand: values.brand.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      category: values.category as RentalVehicleCategory,
      transmission: nullIfEmpty(values.transmission),
      fuelType: nullIfEmpty(values.fuelType),
      seatCount: values.seatCount ? Number(values.seatCount) : null,
      doorCount: values.doorCount ? Number(values.doorCount) : null,
      color: nullIfEmpty(values.color),
      dailyPrice: Number(values.dailyPrice),
      weeklyPrice: values.weeklyPrice ? Number(values.weeklyPrice) : null,
      monthlyPrice: values.monthlyPrice ? Number(values.monthlyPrice) : null,
      deposit: values.deposit ? Number(values.deposit) : null,
      minRentalDays: Number(values.minRentalDays),
      description: nullIfEmpty(values.description),
      status: values.status,
      isFeatured: values.isFeatured,
      features: values.features,
      images: values.images.map((image) => ({
        url: image.url,
        altText: image.altText || null,
        category: image.category || null,
      })),
    };

    startTransition(async () => {
      try {
        if (vehicleId) {
          await updateRentalVehicleAction(vehicleId, input);
        } else {
          await createRentalVehicleAction(input);
        }
      } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
        console.error("[rental-vehicle-form] Kaydetme hatasi:", error);
        toast.error("Kaydedilirken bir hata oluştu.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Temel Bilgiler
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="brand">Marka *</Label>
            <Input
              id="brand"
              value={values.brand}
              onChange={(e) => update("brand", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              value={values.model}
              onChange={(e) => update("model", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Kategori *</Label>
            <select
              id="category"
              className={selectClassName()}
              value={values.category}
              onChange={(e) => update("category", e.target.value as RentalVehicleCategory)}
              required
            >
              <option value="">Seçiniz</option>
              {RENTAL_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="year">Model Yılı *</Label>
            <Input
              id="year"
              type="number"
              value={values.year}
              onChange={(e) => update("year", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">Durum *</Label>
            <select
              id="status"
              className={selectClassName()}
              value={values.status}
              onChange={(e) => update("status", e.target.value as RentalVehicleStatus)}
            >
              {RENTAL_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 pt-6 text-sm font-medium">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(e) => update("isFeatured", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Öne çıkan araç olarak göster
          </label>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea
            id="description"
            rows={4}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Teknik Özellikler
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="fuelType">Yakıt Tipi</Label>
            <select
              id="fuelType"
              className={selectClassName()}
              value={values.fuelType}
              onChange={(e) => update("fuelType", e.target.value)}
            >
              <option value="">Seçiniz</option>
              {RENTAL_FUEL_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="transmission">Şanzıman</Label>
            <select
              id="transmission"
              className={selectClassName()}
              value={values.transmission}
              onChange={(e) => update("transmission", e.target.value)}
            >
              <option value="">Seçiniz</option>
              {RENTAL_TRANSMISSIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="color">Renk</Label>
            <Input
              id="color"
              value={values.color}
              onChange={(e) => update("color", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seatCount">Koltuk Sayısı</Label>
            <Input
              id="seatCount"
              type="number"
              value={values.seatCount}
              onChange={(e) => update("seatCount", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="doorCount">Kapı Sayısı</Label>
            <Input
              id="doorCount"
              type="number"
              value={values.doorCount}
              onChange={(e) => update("doorCount", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Fiyatlandırma
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="dailyPrice">Günlük Fiyat (TL) *</Label>
            <Input
              id="dailyPrice"
              type="number"
              value={values.dailyPrice}
              onChange={(e) => update("dailyPrice", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="weeklyPrice">Haftalık Fiyat (TL)</Label>
            <Input
              id="weeklyPrice"
              type="number"
              value={values.weeklyPrice}
              onChange={(e) => update("weeklyPrice", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="monthlyPrice">Aylık Fiyat (TL)</Label>
            <Input
              id="monthlyPrice"
              type="number"
              value={values.monthlyPrice}
              onChange={(e) => update("monthlyPrice", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deposit">Depozito (TL)</Label>
            <Input
              id="deposit"
              type="number"
              value={values.deposit}
              onChange={(e) => update("deposit", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="minRentalDays">Minimum Kiralama (Gün) *</Label>
            <Input
              id="minRentalDays"
              type="number"
              min={1}
              value={values.minRentalDays}
              onChange={(e) => update("minRentalDays", e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Donanım
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {RENTAL_FEATURE_OPTIONS.map((feature) => (
            <label key={feature} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.features.includes(feature)}
                onChange={() => toggleFeature(feature)}
                className="h-4 w-4 rounded border-input"
              />
              {feature}
            </label>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Input
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            placeholder="Özel donanım ekle"
            className="max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomFeature();
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addCustomFeature}>
            Ekle
          </Button>
        </div>
        {values.features.filter((f) => !RENTAL_FEATURE_OPTIONS.includes(f)).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.features
              .filter((f) => !RENTAL_FEATURE_OPTIONS.includes(f))
              .map((feature) => (
                <span
                  key={feature}
                  className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs"
                >
                  {feature}
                  <button type="button" onClick={() => toggleFeature(feature)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Fotoğraflar *
        </h2>
        <ImageUploader
          images={values.images}
          onChange={(images) => update("images", images)}
          folder="rentals"
        />
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Kaydediliyor..." : vehicleId ? "Değişiklikleri Kaydet" : "Aracı Kaydet"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/kiralama")}
        >
          Vazgeç
        </Button>
      </div>
    </form>
  );
}
