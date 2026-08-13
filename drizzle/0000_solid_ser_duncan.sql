CREATE TYPE "public"."damage_status" AS ENUM('yok', 'var');--> statement-breakpoint
CREATE TYPE "public"."vehicle_category" AS ENUM('cift_kabin_pickup', 'ticari', 'suv', 'otomobil', 'arazi', 'premium');--> statement-breakpoint
CREATE TYPE "public"."vehicle_status" AS ENUM('satista', 'rezerve', 'satildi');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vehicle_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"label" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"alt_text" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"brand" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"mileage" integer NOT NULL,
	"price" integer NOT NULL,
	"engine" varchar(100),
	"engine_displacement" varchar(50),
	"engine_power" varchar(50),
	"fuel_type" varchar(50),
	"transmission" varchar(50),
	"drivetrain" varchar(50),
	"body_type" varchar(50),
	"color" varchar(50),
	"door_count" integer,
	"category" "vehicle_category" NOT NULL,
	"description" text,
	"status" "vehicle_status" DEFAULT 'satista' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"engine_condition" text,
	"transmission_condition" text,
	"body_condition" text,
	"paint_condition" text,
	"changed_parts" text,
	"damage_status" "damage_status" DEFAULT 'yok' NOT NULL,
	"damage_info" text,
	"expertise_report_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "vehicle_features" ADD CONSTRAINT "vehicle_features_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_images" ADD CONSTRAINT "vehicle_images_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;