import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import "server-only";

/**
 * SQLite connection, created once per process.
 *
 * Next.js hot-reloads modules in development, so the instance is cached on
 * `globalThis` to avoid opening a new handle on every reload.
 */
declare global {
  var __rosaDb: Database.Database | undefined;
}

function connect(): Database.Database {
  const file = process.env.DATABASE_FILE ?? join(process.cwd(), "data", "rosa.db");
  const db = new Database(file);

  // WAL allows concurrent reads while a write is in flight.
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const schema = readFileSync(
    join(process.cwd(), "src", "lib", "db", "schema.sql"),
    "utf8",
  );
  db.exec(schema);

  return db;
}

export const db = globalThis.__rosaDb ?? connect();

if (process.env.NODE_ENV !== "production") {
  globalThis.__rosaDb = db;
}
