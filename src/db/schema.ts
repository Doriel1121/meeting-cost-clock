import { pgTable, serial, text, integer, numeric, timestamp, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const meetingSessions = pgTable(
  "meeting_sessions",
  {
    id: serial("id").primaryKey(),
    publicId: text("public_id").notNull().unique(),
    editKeyHash: text("edit_key_hash").notNull(),
    attendeeCount: integer("attendee_count").notNull().default(1),
    hourlyRate: numeric("hourly_rate", { precision: 12, scale: 2 }).notNull(),
    currencySymbol: text("currency_symbol").notNull().default("$"),
    status: text("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    finalDurationSeconds: integer("final_duration_seconds"),
    finalTotalCost: numeric("final_total_cost", { precision: 12, scale: 2 }),
  },
  (t) => ({
    publicIdIdx: uniqueIndex("idx_session_public_id").on(t.publicId),
    statusCheck: check("status_check", sql`status IN ('running', 'ended')`),
  }),
);

export const ratePresets = pgTable("rate_presets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  attendeeCount: integer("attendee_count").notNull(),
  hourlyRate: numeric("hourly_rate", { precision: 12, scale: 2 }).notNull(),
});
