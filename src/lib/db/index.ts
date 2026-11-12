import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import "server-only";

/** Bump when schema.sql or the bootstrap below changes, so a warm dev process reapplies it. */
const SCHEMA_VERSION = 2;

declare global {
  var __taxiPool: mysql.Pool | undefined;
  var __taxiSchema: Promise<void> | undefined;
  var __taxiSchemaVersion: number | undefined;
}

/**
 * MySQL / MariaDB connection pool, configured from DB_* env vars.
 *
 * Next.js hot-reloads modules in development, so the pool is cached on
 * `globalThis` to avoid opening new connections on every reload. The pool is
 * created on first use, not on import, so `next build` does not need the
 * database.
 */
function createPool(): mysql.Pool {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error("Database is not configured: set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME");
  }

  const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT ?? 3306),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    // Shared hosting caps connections per user; serverless instances each
    // get their own pool, so keep this small.
    connectionLimit: 5,
    waitForConnections: true,
    // Store and read every DATETIME as UTC, returned as plain strings.
    timezone: "Z",
    dateStrings: true,
    charset: "utf8mb4",
  });

  pool.on("connection", (conn) => {
    conn.query("SET time_zone = '+00:00'");
    // The host runs in non-strict mode, which silently truncates oversized
    // values. Make bad writes fail loudly instead.
    conn.query(
      "SET SESSION sql_mode = 'STRICT_ALL_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'",
    );
  });

  return pool;
}

function getPool(): mysql.Pool {
  globalThis.__taxiPool ??= createPool();
  return globalThis.__taxiPool;
}

/**
 * Creates any missing tables, then makes sure an admin exists.
 * Cached per process; a new SCHEMA_VERSION runs it again after hot reload.
 */
function ensureSchema(): Promise<void> {
  if (globalThis.__taxiSchema && globalThis.__taxiSchemaVersion === SCHEMA_VERSION) {
    return globalThis.__taxiSchema;
  }

  globalThis.__taxiSchemaVersion = SCHEMA_VERSION;
  globalThis.__taxiSchema = (async () => {
    const schema = readFileSync(
      join(process.cwd(), "src", "lib", "db", "schema.sql"),
      "utf8",
    );
    const statements = schema
      .split(/^\s*;\s*$/m)
      .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
      .filter(Boolean);
    const pool = getPool();
    for (const sql of statements) await pool.query(sql);
    await ensureAdminExists(pool);
  })().catch((err) => {
    // Let the next request retry instead of caching the failure.
    globalThis.__taxiSchema = undefined;
    globalThis.__taxiSchemaVersion = undefined;
    throw err;
  });
  return globalThis.__taxiSchema;
}

/**
 * Accounts created before roles were enforced are all operators. If none is an
 * admin, the earliest account becomes one so the panel can still be administered.
 */
async function ensureAdminExists(pool: mysql.Pool): Promise<void> {
  const [rows] = await pool.query("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'");
  const count = Number((rows as { n: number }[])[0]?.n ?? 0);
  if (count > 0) return;
  await pool.query(
    "UPDATE users SET role = 'admin' ORDER BY created_at ASC, id ASC LIMIT 1",
  );
}

type Param = string | number | null | Date;

/** Runs a SELECT and returns its rows. */
export async function query<T>(sql: string, params: Param[] = []): Promise<T[]> {
  await ensureSchema();
  const [rows] = await getPool().execute(sql, params);
  return rows as T[];
}

/** Runs a SELECT and returns the first row, or undefined. */
export async function queryOne<T>(sql: string, params: Param[] = []): Promise<T | undefined> {
  return (await query<T>(sql, params))[0];
}

/** Runs an INSERT / UPDATE / DELETE. */
export async function execute(sql: string, params: Param[] = []): Promise<void> {
  await ensureSchema();
  await getPool().execute(sql, params);
}
