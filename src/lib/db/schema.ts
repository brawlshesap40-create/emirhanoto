import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const vehicleStatusEnum = pgEnum("vehicle_status", [
  "satista",
  "rezerve",
  "satildi",
]);

export const vehicleCategoryEnum = pgEnum("vehicle_category", [
  "cift_kabin_pickup",
  "ticari",
  "suv",
  "otomobil",
  "arazi",
  "premium",
]);

export const damageStatusEnum = pgEnum("damage_status", ["yok", "var"]);

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),

  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  price: integer("price").notNull(),

  engine: varchar("engine", { length: 100 }),
  engineDisplacement: varchar("engine_displacement", { length: 50 }),
  enginePower: varchar("engine_power", { length: 50 }),
  fuelType: varchar("fuel_type", { length: 50 }),
  transmission: varchar("transmission", { length: 50 }),
  drivetrain: varchar("drivetrain", { length: 50 }),
  bodyType: varchar("body_type", { length: 50 }),
  color: varchar("color", { length: 50 }),
  doorCount: integer("door_count"),
  category: vehicleCategoryEnum("category").notNull(),

  description: text("description"),
  status: vehicleStatusEnum("status").notNull().default("satista"),
  isFeatured: boolean("is_featured").notNull().default(false),

  // Ekspertiz / hasar-degisen bilgileri
  engineCondition: text("engine_condition"),
  transmissionCondition: text("transmission_condition"),
  bodyCondition: text("body_condition"),
  paintCondition: text("paint_condition"),
  changedParts: text("changed_parts"),
  damageStatus: damageStatusEnum("damage_status").notNull().default("yok"),
  damageInfo: text("damage_info"),
  expertiseReportUrl: text("expertise_report_url"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const vehicleImages = pgTable("vehicle_images", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  altText: varchar("alt_text", { length: 255 }),
});

export const vehicleFeatures = pgTable("vehicle_features", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }).notNull(),
});

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  images: many(vehicleImages),
  features: many(vehicleFeatures),
}));

export const vehicleImagesRelations = relations(vehicleImages, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleImages.vehicleId],
    references: [vehicles.id],
  }),
}));

export const vehicleFeaturesRelations = relations(
  vehicleFeatures,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [vehicleFeatures.vehicleId],
      references: [vehicles.id],
    }),
  })
);
