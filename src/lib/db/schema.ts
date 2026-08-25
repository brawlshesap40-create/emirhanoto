import { relations } from "drizzle-orm";
import {
  boolean,
  date,
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

export const requestStatusEnum = pgEnum("request_status", [
  "yeni",
  "gorusuluyor",
  "sonuclandi",
]);

export const testDriveStatusEnum = pgEnum("test_drive_status", [
  "yeni",
  "onaylandi",
  "tamamlandi",
  "iptal",
]);

export const rentalVehicleStatusEnum = pgEnum("rental_vehicle_status", [
  "musait",
  "kirada",
  "bakimda",
]);

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

  previousPrice: integer("previous_price"),
  viewCount: integer("view_count").notNull().default(0),
  videoUrl: text("video_url"),

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
  category: varchar("category", { length: 20 }),
});

export const vehicleFeatures = pgTable("vehicle_features", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }).notNull(),
});

export const valuationRequests = pgTable("valuation_requests", {
  id: serial("id").primaryKey(),

  fullName: varchar("full_name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }),

  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  description: text("description"),

  status: requestStatusEnum("status").notNull().default("yeni"),
  offeredPrice: integer("offered_price"),
  adminNote: text("admin_note"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const testDriveRequests = pgTable("test_drive_requests", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),

  fullName: varchar("full_name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }),

  preferredDate: date("preferred_date"),
  preferredTimeSlot: varchar("preferred_time_slot", { length: 50 }),
  viaVideoCall: boolean("via_video_call").notNull().default(false),
  note: text("note"),

  status: testDriveStatusEnum("status").notNull().default("yeni"),
  adminNote: text("admin_note"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),

  fullName: varchar("full_name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 255 }),
  message: text("message").notNull(),

  status: requestStatusEnum("status").notNull().default("yeni"),
  adminNote: text("admin_note"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const priceAlertRequests = pgTable("price_alert_requests", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),

  fullName: varchar("full_name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 255 }),

  notified: boolean("notified").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const creditApplications = pgTable("credit_applications", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id, {
    onDelete: "set null",
  }),

  fullName: varchar("full_name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }),
  note: text("note"),

  status: requestStatusEnum("status").notNull().default("yeni"),
  adminNote: text("admin_note"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const stockAlertSubscriptions = pgTable("stock_alert_subscriptions", {
  id: serial("id").primaryKey(),

  email: varchar("email", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 100 }),
  category: vehicleCategoryEnum("category"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const listingIssueReports = pgTable("listing_issue_reports", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),

  message: text("message").notNull(),
  email: varchar("email", { length: 255 }),

  resolved: boolean("resolved").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const rentalVehicles = pgTable("rental_vehicles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),

  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  category: vehicleCategoryEnum("category").notNull(),

  transmission: varchar("transmission", { length: 50 }),
  fuelType: varchar("fuel_type", { length: 50 }),
  seatCount: integer("seat_count"),
  doorCount: integer("door_count"),
  color: varchar("color", { length: 50 }),

  dailyPrice: integer("daily_price").notNull(),
  weeklyPrice: integer("weekly_price"),
  monthlyPrice: integer("monthly_price"),
  deposit: integer("deposit"),
  minRentalDays: integer("min_rental_days").notNull().default(1),

  description: text("description"),
  status: rentalVehicleStatusEnum("status").notNull().default("musait"),
  isFeatured: boolean("is_featured").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const rentalVehicleImages = pgTable("rental_vehicle_images", {
  id: serial("id").primaryKey(),
  rentalVehicleId: integer("rental_vehicle_id")
    .notNull()
    .references(() => rentalVehicles.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  altText: varchar("alt_text", { length: 255 }),
  category: varchar("category", { length: 20 }),
});

export const rentalVehicleFeatures = pgTable("rental_vehicle_features", {
  id: serial("id").primaryKey(),
  rentalVehicleId: integer("rental_vehicle_id")
    .notNull()
    .references(() => rentalVehicles.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }).notNull(),
});

export const rentalRequests = pgTable("rental_requests", {
  id: serial("id").primaryKey(),
  rentalVehicleId: integer("rental_vehicle_id")
    .notNull()
    .references(() => rentalVehicles.id, { onDelete: "cascade" }),

  fullName: varchar("full_name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }),

  startDate: date("start_date"),
  endDate: date("end_date"),
  note: text("note"),

  status: requestStatusEnum("status").notNull().default("yeni"),
  adminNote: text("admin_note"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  images: many(vehicleImages),
  features: many(vehicleFeatures),
  testDriveRequests: many(testDriveRequests),
  priceAlertRequests: many(priceAlertRequests),
  creditApplications: many(creditApplications),
  listingIssueReports: many(listingIssueReports),
}));

export const listingIssueReportsRelations = relations(
  listingIssueReports,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [listingIssueReports.vehicleId],
      references: [vehicles.id],
    }),
  })
);

export const creditApplicationsRelations = relations(
  creditApplications,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [creditApplications.vehicleId],
      references: [vehicles.id],
    }),
  })
);

export const priceAlertRequestsRelations = relations(
  priceAlertRequests,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [priceAlertRequests.vehicleId],
      references: [vehicles.id],
    }),
  })
);

export const testDriveRequestsRelations = relations(
  testDriveRequests,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [testDriveRequests.vehicleId],
      references: [vehicles.id],
    }),
  })
);

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

export const rentalVehiclesRelations = relations(rentalVehicles, ({ many }) => ({
  images: many(rentalVehicleImages),
  features: many(rentalVehicleFeatures),
  rentalRequests: many(rentalRequests),
}));

export const rentalVehicleImagesRelations = relations(
  rentalVehicleImages,
  ({ one }) => ({
    rentalVehicle: one(rentalVehicles, {
      fields: [rentalVehicleImages.rentalVehicleId],
      references: [rentalVehicles.id],
    }),
  })
);

export const rentalVehicleFeaturesRelations = relations(
  rentalVehicleFeatures,
  ({ one }) => ({
    rentalVehicle: one(rentalVehicles, {
      fields: [rentalVehicleFeatures.rentalVehicleId],
      references: [rentalVehicles.id],
    }),
  })
);

export const rentalRequestsRelations = relations(rentalRequests, ({ one }) => ({
  rentalVehicle: one(rentalVehicles, {
    fields: [rentalRequests.rentalVehicleId],
    references: [rentalVehicles.id],
  }),
}));
