-- MySQL / MariaDB schema. Applied automatically on first query (see
-- ensureSchema in ./index.ts); every statement must be idempotent.
-- Statements are separated by a line containing only ";".
-- All timestamps are stored in UTC (the pool sets time_zone = '+00:00').

CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(80)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'operator',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
;
CREATE TABLE IF NOT EXISTS sessions (
  id         CHAR(64) NOT NULL PRIMARY KEY,
  user_id    CHAR(36) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sessions_user (user_id),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
;
CREATE TABLE IF NOT EXISTS drivers (
  id          CHAR(36)    NOT NULL PRIMARY KEY,
  name        VARCHAR(80) NOT NULL,
  phone       VARCHAR(20) NOT NULL,
  -- Vehicle
  car_make    VARCHAR(40) NOT NULL,
  car_model   VARCHAR(40) NOT NULL,
  car_color   VARCHAR(30) NOT NULL,
  plate       VARCHAR(12) NOT NULL UNIQUE,
  seats       INT         NOT NULL DEFAULT 4,
  -- Service tier, matching the booking flow's tiers
  tier        VARCHAR(20) NOT NULL DEFAULT 'rosa',
  -- Availability and reputation
  status      VARCHAR(20) NOT NULL DEFAULT 'available',
  rating      DOUBLE      NOT NULL DEFAULT 5.0,
  trips       INT         NOT NULL DEFAULT 0,
  -- Last known position, for assigning the nearest driver
  lat         DOUBLE NULL,
  lng         DOUBLE NULL,
  created_by  CHAR(36) NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_drivers_status (status),
  INDEX idx_drivers_tier (tier),
  CONSTRAINT fk_drivers_user FOREIGN KEY (created_by)
    REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
