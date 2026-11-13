-- Drizzle SQL Migration 0000_initial_schema.sql
CREATE TABLE IF NOT EXISTS "meeting_sessions" (
\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
\t"public_id" text NOT NULL,
\t"edit_key_hash" text NOT NULL,
\t"attendee_count" integer NOT NULL,
\t"hourly_rate" numeric(10, 2) NOT NULL,
\t"currency_symbol" text DEFAULT '$' NOT NULL,
\t"status" text DEFAULT 'running' NOT NULL,
\t"started_at" timestamp with time zone DEFAULT now() NOT NULL,
\t"ended_at" timestamp with time zone,
\t"final_duration_seconds" integer,
\t"final_total_cost" numeric(10, 2),
\t"created_at" timestamp with time zone DEFAULT now() NOT NULL,
\t"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
\tCONSTRAINT "meeting_sessions_public_id_unique" UNIQUE("public_id"),
\tCONSTRAINT "check_attendee_count" CHECK ("meeting_sessions"."attendee_count" >= 1),
\tCONSTRAINT "check_hourly_rate" CHECK ("meeting_sessions"."hourly_rate" >= 0.00),
\tCONSTRAINT "check_status" CHECK ("meeting_sessions"."status" IN ('running', 'ended'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rate_presets" (
\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
\t"host_key_hash" text,
\t"name" text NOT NULL,
\t"attendee_count" integer NOT NULL,
\t"hourly_rate" numeric(10, 2) NOT NULL,
\t"is_system_default" boolean DEFAULT false NOT NULL,
\t"created_at" timestamp with time zone DEFAULT now() NOT NULL,
\tCONSTRAINT "check_preset_attendees" CHECK ("rate_presets"."attendee_count" >= 1),
\tCONSTRAINT "check_preset_rate" CHECK ("rate_presets"."hourly_rate" >= 0.00)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_public_id" ON "meeting_sessions" USING btree ("public_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_created_at" ON "meeting_sessions" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_rate_presets_host_key" ON "rate_presets" USING btree ("host_key_hash");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_rate_presets_system_default" ON "rate_presets" USING btree ("is_system_default");
