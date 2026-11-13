import { pgTable, uuid, text, integer, numeric, boolean, timestamp, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const meetingSessions = pgTable(
  'meeting_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    publicId: text('public_id').notNull().unique(),
    editKeyHash: text('edit_key_hash').notNull(),
    attendeeCount: integer('attendee_count').notNull(),
    hourlyRate: numeric('hourly_rate', { precision: 10, scale: 2 }).notNull(),
    currencySymbol: text('currency_symbol').notNull().default('$'),
    status: text('status').notNull().default('running'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    finalDurationSeconds: integer('final_duration_seconds'),
    finalTotalCost: numeric('final_total_cost', { precision: 10, scale: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_sessions_public_id').on(table.publicId),
    index('idx_sessions_created_at').on(table.createdAt),
    check('check_attendee_count', sql`${table.attendeeCount} >= 1`),
    check('check_hourly_rate', sql`${table.hourlyRate} >= 0.00`),
    check('check_status', sql`${table.status} IN ('running', 'ended')`),
  ]
);

export const ratePresets = pgTable(
  'rate_presets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    hostKeyHash: text('host_key_hash'),
    name: text('name').notNull(),
    attendeeCount: integer('attendee_count').notNull(),
    hourlyRate: numeric('hourly_rate', { precision: 10, scale: 2 }).notNull(),
    isSystemDefault: boolean('is_system_default').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_rate_presets_host_key').on(table.hostKeyHash),
    index('idx_rate_presets_system_default').on(table.isSystemDefault),
    check('check_preset_attendees', sql`${table.attendeeCount} >= 1`),
    check('check_preset_rate', sql`${table.hourlyRate} >= 0.00`),
  ]
);

export type MeetingSession = typeof meetingSessions.$inferSelect;
export type NewMeetingSession = typeof meetingSessions.$inferInsert;
export type RatePreset = typeof ratePresets.$inferSelect;
export type NewRatePreset = typeof ratePresets.$inferInsert;