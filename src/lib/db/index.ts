import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
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

/**
 * Where the database file lives.
 *
 * On a serverless host the project directory is read-only and `/tmp` is the
 * only writable path, so the file goes there. That storage is per-instance and
 * wiped on cold start: see the deployment note in the README before relying on
 * anything surviving a request.
 */
function databaseFile(): string {
  if (process.env.DATABASE_FILE) return process.env.DATABASE_FILE;
  if (process.env.VERCEL) return "/tmp/rosa.db";
  return join(process.cwd(), "data", "rosa.db");
}

function connect(): Database.Database {
  const file = databaseFile();

  // better-sqlite3 creates the file but not its parent directory.
  mkdirSync(dirname(file), { recursive: true });

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

let instance: Database.Database | undefined;

function getDb(): Database.Database {
  if (!instance) {
    instance = globalThis.__rosaDb ?? connect();
    if (process.env.NODE_ENV !== "production") globalThis.__rosaDb = instance;
  }
  return instance;
}

/**
 * Connects on first use rather than on import. `next build` evaluates every
 * route module to collect its config, and connecting at module scope made the
 * build itself depend on a writable filesystem.
 */
export const db = new Proxy({} as Database.Database, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
