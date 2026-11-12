import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { execute, queryOne } from "@/lib/db";
import "server-only";

const SESSION_COOKIE = "taximex_session";
const SESSION_DAYS = 30;

/** Operators run the fleet. Admins also manage who can sign in. */
export type Role = "operator" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

/** Unknown values fail closed: they can run the fleet, not administer accounts. */
export function asRole(value: string): Role {
  return value === "admin" ? "admin" : "operator";
}

/**
 * Comma-separated emails in `ADMIN_EMAILS`. Those accounts are promoted to
 * admin when they sign in, which also recovers access if every admin is lost.
 */
export function isListedAdmin(email: string): boolean {
  const listed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.includes("@"));
  return listed.includes(email.toLowerCase().trim());
}

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

export async function userCount(): Promise<number> {
  const row = await queryOne<{ n: number }>(`SELECT COUNT(*) AS n FROM users`);
  return Number(row?.n ?? 0);
}

export async function createUser(
  email: string,
  name: string,
  password: string,
): Promise<User> {
  const id = randomUUID();
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedName = name.trim();
  // The first account has to be able to grant access to everyone else.
  const role: Role =
    (await userCount()) === 0 || isListedAdmin(normalizedEmail) ? "admin" : "operator";
  await execute(
    `INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    [id, normalizedEmail, normalizedName, hashPassword(password), role],
  );
  return { id, email: normalizedEmail, name: normalizedName, role };
}

/** Promotes an env-listed address at sign-in. Never demotes. */
export async function promoteListedAdmin(user: {
  id: string;
  email: string;
  role: string;
}): Promise<void> {
  if (asRole(user.role) === "admin" || !isListedAdmin(user.email)) return;
  await execute(`UPDATE users SET role = 'admin' WHERE id = ?`, [user.id]);
}

export function findUserByEmail(email: string) {
  return queryOne<{
    id: string;
    email: string;
    name: string;
    password_hash: string;
    role: string;
  }>(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
}

/** Issues a session row and sets the cookie. */
export async function startSession(userId: string) {
  const id = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);

  await execute(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`,
    [id, userId, expires],
  );

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
    await execute(`DELETE FROM sessions WHERE id = ?`, [id]);
    jar.delete(SESSION_COOKIE);
  }
}

/** The signed-in user, or null. Expired sessions are cleaned up on read. */
export const currentUser = cache(async (): Promise<User | null> => {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;

  // Compare in SQL: both sides are UTC there.
  const row = await queryOne<User & { expired: number }>(
    `SELECT u.id, u.email, u.name, u.role,
            s.expires_at < UTC_TIMESTAMP() AS expired
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.id = ?`,
    [id],
  );

  if (!row) return null;

  if (row.expired) {
    await execute(`DELETE FROM sessions WHERE id = ?`, [id]);
    return null;
  }

  return { id: row.id, email: row.email, name: row.name, role: asRole(row.role) };
});
