-- UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- enum for record source (aligns with backend: RecordSource { LIVE, MANUAL })
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_source') THEN
    CREATE TYPE record_source AS ENUM ('LIVE', 'MANUAL');
  END IF;
END $$;

-- users
CREATE TABLE IF NOT EXISTS users (
  id          BIGSERIAL PRIMARY KEY,
  email       VARCHAR(255),
  name        VARCHAR(255),
  google_sub  VARCHAR(255) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique indexes for users
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users (google_sub);
-- case-insensitive email uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email_ci ON users (LOWER(email));

-- activities
CREATE TABLE IF NOT EXISTS activities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         VARCHAR(100) NOT NULL,
  target_time  INT NOT NULL DEFAULT 0 CHECK (target_time >= 0),  -- weekly minutes
  color        VARCHAR(16),
  icon         VARCHAR(16),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_activity_name_per_user UNIQUE (user_id, name)
);

-- Create indexes for activities
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);

-- activity_records
-- Model:
--   - source = LIVE|MANUAL
--   - duration NULL while LIVE is in-progress; >0 when finished
--   - executed_at = when it happened/started (tz-aware)
CREATE TABLE IF NOT EXISTS activity_records (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id  UUID   NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  source       record_source NOT NULL,
  duration     INT CHECK (duration IS NULL OR duration > 0),
  executed_at  TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one in-progress LIVE record per (user, activity)
CREATE UNIQUE INDEX IF NOT EXISTS uq_live_record_per_activity
  ON activity_records(user_id, activity_id)
  WHERE duration IS NULL AND source = 'LIVE';

-- Fast "latest first" lookups
CREATE INDEX IF NOT EXISTS idx_records_user_time
  ON activity_records(user_id, executed_at DESC);

CREATE INDEX IF NOT EXISTS idx_records_activity_time
  ON activity_records(activity_id, executed_at DESC);
