export const CATEGORY_LABELS = {
  cift_kabin_pickup: "Çift Kabin / Pick-up",
  ticari: "Ticari Araç",
  suv: "SUV",
  otomobil: "Otomobil",
  arazi: "Arazi Aracı",
  premium: "Premium Araç",
} as const;

export type VehicleCategory = keyof typeof CATEGORY_LABELS;

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value: value as VehicleCategory, label })
);

export const STATUS_LABELS = {
  satista: "Satışta",
  rezerve: "Rezerve",
  satildi: "Satıldı",
} as const;

export type VehicleStatus = keyof typeof STATUS_LABELS;

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(
  ([value, label]) => ({ value: value as VehicleStatus, label })
);

export const PRIORITY_BRANDS = [
  "Toyota",
  "Isuzu",
  "Ford",
  "Mitsubishi",
  "Volkswagen",
  "Renault",
];

export const FUEL_TYPES = [
  "Dizel",
  "Benzin",
  "Benzin+LPG",
  "Hibrit",
  "Elektrik",
];

export const TRANSMISSIONS = ["Manuel", "Otomatik", "Yarı Otomatik"];

export const DRIVETRAINS = ["4x2", "4x4", "Önden Çekiş", "Arkadan İtiş"];

export const BODY_TYPES = [
  "Pick-up",
  "Kapalı Kasa",
  "Açık Kasa",
  "SUV",
  "Sedan",
  "Hatchback",
  "Station Wagon",
  "Arazi Aracı",
];

export const FEATURE_OPTIONS = [
  "Geri Görüş Kamerası",
  "Park Sensörü",
  "Apple CarPlay",
  "Android Auto",
  "Isıtmalı Koltuk",
  "Deri Koltuk",
  "Adaptif Hız Sabitleyici",
  "LED Far",
  "Sunroof",
  "Klima",
  "Elektrikli Cam",
  "Elektrikli Ayna",
  "Yokuş Kalkış Desteği",
  "Şerit Takip Sistemi",
  "Kör Nokta Uyarı Sistemi",
];

export const DAMAGE_STATUS_LABELS = {
  yok: "Hasar Kaydı Yok",
  var: "Hasar Kaydı Mevcut",
} as const;
