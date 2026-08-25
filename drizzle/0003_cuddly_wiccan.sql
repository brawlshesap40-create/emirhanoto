CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"phone" varchar(30),
	"email" varchar(255),
	"message" text NOT NULL,
	"status" "request_status" DEFAULT 'yeni' NOT NULL,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_alert_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"phone" varchar(30),
	"email" varchar(255),
	"notified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "test_drive_requests" ADD COLUMN "preferred_time_slot" varchar(50);--> statement-breakpoint
ALTER TABLE "vehicle_images" ADD COLUMN "category" varchar(20);--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "previous_price" integer;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "video_url" text;--> statement-breakpoint
ALTER TABLE "price_alert_requests" ADD CONSTRAINT "price_alert_requests_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;