import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import "server-only";

const SESSION_COOKIE = "taximex_session";
const SESSION_DAYS = 30;

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

/** scrypt with a per-password random salt, stored as `salt:hash`. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  // Constant-time compare, so timing does not leak the hash.
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createUser(email: string, name: string, password: string): User {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)`,
  ).run(id, email.toLowerCase().trim(), name.trim(), hashPassword(password));
  return { id, email: email.toLowerCase().trim(), name: name.trim(), role: "operator" };
}

export function findUserByEmail(email: string) {
  return db
    .prepare(`SELECT * FROM users WHERE email = ?`)
    .get(email.toLowerCase().trim()) as
    | { id: string; email: string; name: string; password_hash: string; role: string }
    | undefined;
}

/** Issues a session row and sets the cookie. */
export async function startSession(userId: string) {
  const id = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);

  db.prepare(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`,
  ).run(id, userId, expires.toISOString());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });
}

export async function endSession() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) {
    db.prepare(`DELETE FROM sessions WHERE id = ?`).run(id);
    jar.delete(SESSION_COOKIE);
  }
}

/** The signed-in user, or null. Expired sessions are cleaned up on read. */
export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;

  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, s.expires_at
         FROM sessions s
         JOIN users u ON u.id = s.user_id
        WHERE s.id = ?`,
    )
    .get(id) as (User & { expires_at: string }) | undefined;

  if (!row) return null;

  if (new Date(row.expires_at) < new Date()) {
    db.prepare(`DELETE FROM sessions WHERE id = ?`).run(id);
    return null;
  }

  return { id: row.id, email: row.email, name: row.name, role: row.role };
}
