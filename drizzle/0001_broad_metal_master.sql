CREATE TYPE "public"."billing" AS ENUM('free', 'pro', 'premium');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "billing" SET DEFAULT 'free'::"public"."billing";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "billing" SET DATA TYPE "public"."billing" USING "billing"::"public"."billing";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "billing" SET NOT NULL;