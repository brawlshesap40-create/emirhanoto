CREATE TYPE "public"."test_drive_status" AS ENUM('yeni', 'onaylandi', 'tamamlandi', 'iptal');--> statement-breakpoint
CREATE TABLE "test_drive_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"email" varchar(255),
	"preferred_date" date,
	"note" text,
	"status" "test_drive_status" DEFAULT 'yeni' NOT NULL,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "test_drive_requests" ADD CONSTRAINT "test_drive_requests_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;