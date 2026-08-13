CREATE TYPE "public"."request_status" AS ENUM('yeni', 'gorusuluyor', 'sonuclandi');--> statement-breakpoint
CREATE TABLE "valuation_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"email" varchar(255),
	"brand" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"mileage" integer NOT NULL,
	"description" text,
	"status" "request_status" DEFAULT 'yeni' NOT NULL,
	"offered_price" integer,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
