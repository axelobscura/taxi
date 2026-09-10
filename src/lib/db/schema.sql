-- Portable SQL. Types chosen to work on both SQLite and Postgres where
-- possible; see README for the Postgres migration notes.

CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'operator',
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS drivers (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  -- Vehicle
  car_make    TEXT NOT NULL,
  car_model   TEXT NOT NULL,
  car_color   TEXT NOT NULL,
  plate       TEXT NOT NULL UNIQUE,
  seats       INTEGER NOT NULL DEFAULT 4,
  -- Service tier, matching the booking flow's tiers
  tier        TEXT NOT NULL DEFAULT 'rosa',
  -- Availability and reputation
  status      TEXT NOT NULL DEFAULT 'available',
  rating      REAL NOT NULL DEFAULT 5.0,
  trips       INTEGER NOT NULL DEFAULT 0,
  -- Last known position, for assigning the nearest driver
  lat         REAL,
  lng         REAL,
  created_by  TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_tier ON drivers(tier);
