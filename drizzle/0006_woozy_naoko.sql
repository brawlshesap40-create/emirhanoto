CREATE TYPE "public"."rental_vehicle_status" AS ENUM('musait', 'kirada', 'bakimda');--> statement-breakpoint
CREATE TABLE "rental_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"rental_vehicle_id" integer NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"email" varchar(255),
	"start_date" date,
	"end_date" date,
	"note" text,
	"status" "request_status" DEFAULT 'yeni' NOT NULL,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rental_vehicle_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"rental_vehicle_id" integer NOT NULL,
	"label" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rental_vehicle_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"rental_vehicle_id" integer NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"alt_text" varchar(255),
	"category" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "rental_vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"brand" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"category" "vehicle_category" NOT NULL,
	"transmission" varchar(50),
	"fuel_type" varchar(50),
	"seat_count" integer,
	"door_count" integer,
	"color" varchar(50),
	"daily_price" integer NOT NULL,
	"weekly_price" integer,
	"monthly_price" integer,
	"deposit" integer,
	"min_rental_days" integer DEFAULT 1 NOT NULL,
	"description" text,
	"status" "rental_vehicle_status" DEFAULT 'musait' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rental_vehicles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_rental_vehicle_id_rental_vehicles_id_fk" FOREIGN KEY ("rental_vehicle_id") REFERENCES "public"."rental_vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_vehicle_features" ADD CONSTRAINT "rental_vehicle_features_rental_vehicle_id_rental_vehicles_id_fk" FOREIGN KEY ("rental_vehicle_id") REFERENCES "public"."rental_vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_vehicle_images" ADD CONSTRAINT "rental_vehicle_images_rental_vehicle_id_rental_vehicles_id_fk" FOREIGN KEY ("rental_vehicle_id") REFERENCES "public"."rental_vehicles"("id") ON DELETE cascade ON UPDATE no action;