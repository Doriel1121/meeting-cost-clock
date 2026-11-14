CREATE TABLE IF NOT EXISTS meeting_sessions (
  id SERIAL PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  edit_key_hash TEXT NOT NULL,
  attendee_count INTEGER NOT NULL DEFAULT 1,
  hourly_rate NUMERIC(12, 2) NOT NULL,
  currency_symbol TEXT NOT NULL DEFAULT '$',
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  final_duration_seconds INTEGER,
  final_total_cost NUMERIC(12, 2),
  CONSTRAINT status_check CHECK (status IN ('running', 'ended'))
);

CREATE TABLE IF NOT EXISTS rate_presets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  attendee_count INTEGER NOT NULL,
  hourly_rate NUMERIC(12, 2) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_session_public_id ON meeting_sessions(public_id);