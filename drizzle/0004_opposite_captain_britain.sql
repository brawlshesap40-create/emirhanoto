CREATE TABLE "credit_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer,
	"full_name" varchar(150) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"email" varchar(255),
	"note" text,
	"status" "request_status" DEFAULT 'yeni' NOT NULL,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "test_drive_requests" ADD COLUMN "via_video_call" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_applications" ADD CONSTRAINT "credit_applications_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;