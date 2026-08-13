import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { adminUsers, vehicleFeatures, vehicles } from "../src/lib/db/schema";
import { generateVehicleSlug } from "../src/lib/vehicles/slug";

const DEMO_VEHICLES = [
  {
    brand: "Toyota",
    model: "Hilux",
    year: 2022,
    mileage: 42000,
    price: 3450000,
    category: "cift_kabin_pickup" as const,
    engine: "2.4 Dizel",
    engineDisplacement: "2393 cc",
    enginePower: "150 hp",
    fuelType: "Dizel",
    transmission: "Otomatik",
    drivetrain: "4x4",
    bodyType: "Pick-up",
    color: "Beyaz",
    doorCount: 4,
    isFeatured: true,
    features: ["Geri Görüş Kamerası", "Park Sensörü", "Apple CarPlay", "LED Far"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Isuzu",
    model: "D-Max",
    year: 2021,
    mileage: 68000,
    price: 2650000,
    category: "cift_kabin_pickup" as const,
    engine: "1.9 Dizel",
    engineDisplacement: "1898 cc",
    enginePower: "164 hp",
    fuelType: "Dizel",
    transmission: "Manuel",
    drivetrain: "4x4",
    bodyType: "Pick-up",
    color: "Gri",
    doorCount: 4,
    isFeatured: true,
    features: ["Park Sensörü", "Klima", "Yokuş Kalkış Desteği"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Ön tampon boyalı",
  },
  {
    brand: "Ford",
    model: "Ranger",
    year: 2023,
    mileage: 18000,
    price: 4200000,
    category: "cift_kabin_pickup" as const,
    engine: "2.0 Bi-Turbo Dizel",
    engineDisplacement: "1996 cc",
    enginePower: "213 hp",
    fuelType: "Dizel",
    transmission: "Otomatik",
    drivetrain: "4x4",
    bodyType: "Pick-up",
    color: "Siyah",
    doorCount: 4,
    isFeatured: true,
    features: [
      "Geri Görüş Kamerası",
      "Adaptif Hız Sabitleyici",
      "Deri Koltuk",
      "LED Far",
      "Kör Nokta Uyarı Sistemi",
    ],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Mitsubishi",
    model: "L200",
    year: 2020,
    mileage: 95000,
    price: 2150000,
    category: "cift_kabin_pickup" as const,
    engine: "2.4 Dizel",
    fuelType: "Dizel",
    transmission: "Manuel",
    drivetrain: "4x4",
    bodyType: "Pick-up",
    color: "Beyaz",
    doorCount: 4,
    features: ["Klima", "Elektrikli Cam"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Sol arka çamurluk boyalı",
    paintCondition: "Kısmi boyalı",
    changedParts: "Sol arka çamurluk",
  },
  {
    brand: "Volkswagen",
    model: "Amarok",
    year: 2022,
    mileage: 39000,
    price: 3950000,
    category: "cift_kabin_pickup" as const,
    engine: "3.0 V6 TDI",
    enginePower: "204 hp",
    fuelType: "Dizel",
    transmission: "Otomatik",
    drivetrain: "4x4",
    bodyType: "Pick-up",
    color: "Gümüş",
    doorCount: 4,
    isFeatured: true,
    features: ["Deri Koltuk", "Isıtmalı Koltuk", "Sunroof", "Adaptif Hız Sabitleyici"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Ford",
    model: "Transit",
    year: 2021,
    mileage: 82000,
    price: 1950000,
    category: "ticari" as const,
    engine: "2.0 Dizel",
    fuelType: "Dizel",
    transmission: "Manuel",
    drivetrain: "Önden Çekiş",
    bodyType: "Kapalı Kasa",
    color: "Beyaz",
    doorCount: 4,
    features: ["Park Sensörü"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Ticari kullanım izleri mevcut",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Volkswagen",
    model: "Transporter",
    year: 2020,
    mileage: 110000,
    price: 2050000,
    category: "ticari" as const,
    engine: "2.0 TDI",
    fuelType: "Dizel",
    transmission: "Manuel",
    drivetrain: "Önden Çekiş",
    bodyType: "Kapalı Kasa",
    color: "Gri",
    doorCount: 4,
    features: ["Klima"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Renault",
    model: "Trafic",
    year: 2022,
    mileage: 45000,
    price: 2350000,
    category: "ticari" as const,
    engine: "2.0 Dizel",
    fuelType: "Dizel",
    transmission: "Manuel",
    drivetrain: "Önden Çekiş",
    bodyType: "Kapalı Kasa",
    color: "Beyaz",
    doorCount: 4,
    features: ["Geri Görüş Kamerası", "Klima"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Isuzu",
    model: "NPR",
    year: 2019,
    mileage: 145000,
    price: 1850000,
    category: "ticari" as const,
    engine: "3.0 Dizel",
    fuelType: "Dizel",
    transmission: "Manuel",
    drivetrain: "Arkadan İtiş",
    bodyType: "Açık Kasa",
    color: "Beyaz",
    doorCount: 2,
    features: [],
    engineCondition: "Bakımlı",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Ticari kullanım izleri mevcut",
    paintCondition: "Kısmi boyalı",
    damageStatus: "var" as const,
    damageInfo: "Arka tampon değişmiş",
    changedParts: "Arka tampon",
  },
  {
    brand: "Toyota",
    model: "Land Cruiser",
    year: 2021,
    mileage: 58000,
    price: 4850000,
    category: "arazi" as const,
    engine: "2.8 Dizel",
    enginePower: "204 hp",
    fuelType: "Dizel",
    transmission: "Otomatik",
    drivetrain: "4x4",
    bodyType: "Arazi Aracı",
    color: "Siyah",
    doorCount: 5,
    isFeatured: true,
    features: [
      "Deri Koltuk",
      "Isıtmalı Koltuk",
      "Sunroof",
      "Adaptif Hız Sabitleyici",
      "LED Far",
      "Android Auto",
    ],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Toyota",
    model: "RAV4",
    year: 2022,
    mileage: 32000,
    price: 3100000,
    category: "suv" as const,
    engine: "2.5 Hibrit",
    fuelType: "Hibrit",
    transmission: "Otomatik",
    drivetrain: "4x2",
    bodyType: "SUV",
    color: "Kırmızı",
    doorCount: 5,
    features: ["Geri Görüş Kamerası", "Apple CarPlay", "Android Auto", "LED Far"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Volkswagen",
    model: "Tiguan",
    year: 2021,
    mileage: 51000,
    price: 2950000,
    category: "suv" as const,
    engine: "2.0 TDI",
    fuelType: "Dizel",
    transmission: "Otomatik",
    drivetrain: "4x2",
    bodyType: "SUV",
    color: "Gri",
    doorCount: 5,
    features: ["Park Sensörü", "Isıtmalı Koltuk"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    mileage: 28000,
    price: 1650000,
    category: "otomobil" as const,
    engine: "1.6 Benzin",
    fuelType: "Benzin",
    transmission: "Otomatik",
    drivetrain: "Önden Çekiş",
    bodyType: "Sedan",
    color: "Beyaz",
    doorCount: 4,
    features: ["Apple CarPlay", "Android Auto", "Klima"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
  {
    brand: "Renault",
    model: "Megane",
    year: 2021,
    mileage: 61000,
    price: 1250000,
    category: "otomobil" as const,
    engine: "1.5 Dizel",
    fuelType: "Dizel",
    transmission: "Manuel",
    drivetrain: "Önden Çekiş",
    bodyType: "Hatchback",
    color: "Mavi",
    doorCount: 4,
    features: ["Klima", "Elektrikli Cam"],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Sağ ön kapı boyalı",
    paintCondition: "Kısmi boyalı",
    changedParts: "Sağ ön kapı",
  },
  {
    brand: "Volkswagen",
    model: "Touareg",
    year: 2023,
    mileage: 12000,
    price: 4950000,
    category: "premium" as const,
    engine: "3.0 V6 TDI",
    enginePower: "286 hp",
    fuelType: "Dizel",
    transmission: "Otomatik",
    drivetrain: "4x4",
    bodyType: "SUV",
    color: "Siyah",
    doorCount: 5,
    isFeatured: true,
    features: [
      "Deri Koltuk",
      "Isıtmalı Koltuk",
      "Sunroof",
      "Adaptif Hız Sabitleyici",
      "Kör Nokta Uyarı Sistemi",
      "Şerit Takip Sistemi",
    ],
    engineCondition: "Sorunsuz",
    transmissionCondition: "Sorunsuz",
    bodyCondition: "Orijinal",
    paintCondition: "Orijinal boya",
  },
];

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD tanimli degil, admin kullanici olusturulmadi."
    );
    return;
  }

  const existing = await db.query.adminUsers.findFirst({
    where: (users, { eq }) => eq(users.email, email.toLowerCase()),
  });
  if (existing) {
    console.log(`Admin kullanici zaten mevcut: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(adminUsers).values({ email: email.toLowerCase(), passwordHash });
  console.log(`Admin kullanici olusturuldu: ${email}`);
}

async function seedVehicles() {
  const existing = await db.select({ id: vehicles.id }).from(vehicles).limit(1);
  if (existing.length > 0) {
    console.log("Zaten arac kayitli, demo veri eklenmedi.");
    return;
  }

  for (const item of DEMO_VEHICLES) {
    const slug = await generateVehicleSlug(item.brand, item.model, item.year);
    const [vehicle] = await db
      .insert(vehicles)
      .values({
        brand: item.brand,
        model: item.model,
        year: item.year,
        mileage: item.mileage,
        price: item.price,
        category: item.category,
        slug,
        engine: item.engine ?? null,
        engineDisplacement: item.engineDisplacement ?? null,
        enginePower: item.enginePower ?? null,
        fuelType: item.fuelType ?? null,
        transmission: item.transmission ?? null,
        drivetrain: item.drivetrain ?? null,
        bodyType: item.bodyType ?? null,
        color: item.color ?? null,
        doorCount: item.doorCount ?? null,
        status: "satista",
        isFeatured: item.isFeatured ?? false,
        engineCondition: item.engineCondition ?? null,
        transmissionCondition: item.transmissionCondition ?? null,
        bodyCondition: item.bodyCondition ?? null,
        paintCondition: item.paintCondition ?? null,
        changedParts: item.changedParts ?? null,
        damageStatus: item.damageStatus ?? "yok",
        damageInfo: item.damageInfo ?? null,
      })
      .returning({ id: vehicles.id });

    if (item.features.length > 0) {
      await db.insert(vehicleFeatures).values(
        item.features.map((label) => ({ vehicleId: vehicle.id, label }))
      );
    }
  }

  console.log(`${DEMO_VEHICLES.length} demo arac eklendi.`);
  console.log(
    "Not: Demo araclarin gercek fotografi yok; admin panelinden fotograf ekleyebilirsiniz."
  );
}

async function main() {
  await seedAdminUser();

  if (process.env.SEED_SKIP_VEHICLES === "true") {
    console.log("SEED_SKIP_VEHICLES=true - demo arac eklenmedi.");
    return;
  }
  await seedVehicles();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
