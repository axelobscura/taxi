import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  asRole,
  currentUser,
  hashPassword,
  isListedAdmin,
  type Role,
  type User,
} from "@/lib/auth";
import { execute, query, queryOne } from "@/lib/db";
import "server-only";

/** Raised when an account change is refused. `status` matches the HTTP code. */
export class UserAdminError extends Error {
  readonly status: 401 | 403 | 404 | 409 | 422;

  constructor(message: string, status: 401 | 403 | 404 | 409 | 422) {
    super(message);
    this.name = "UserAdminError";
    this.status = status;
  }
}

export function userAdminError(err: unknown): UserAdminError | null {
  return err instanceof UserAdminError ? err : null;
}

export const UserInput = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(80),
  email: z.string().trim().email("Correo inválido").max(255),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(200),
  role: z.enum(["operator", "admin"]),
});

export type UserInput = z.infer<typeof UserInput>;

export type UserAccount = {
  id: string;
  email: string;
  name: string;
  role: Role;
  created_at: string;
};

async function assertAdmin(): Promise<User> {
  const user = await currentUser();
  if (!user) throw new UserAdminError("Tu sesión expiró. Vuelve a entrar.", 401);
  if (user.role !== "admin") {
    throw new UserAdminError("Solo un administrador puede hacer esto.", 403);
  }
  return user;
}

async function adminCount(): Promise<number> {
  const row = await queryOne<{ n: number }>(
    `SELECT COUNT(*) AS n FROM users WHERE role = 'admin'`,
  );
  return Number(row?.n ?? 0);
}

export async function listUserAccounts(): Promise<UserAccount[]> {
  await assertAdmin();
  const rows = await query<Omit<UserAccount, "role"> & { role: string }>(
    `SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC`,
  );
  return rows.map((row) => ({ ...row, role: asRole(row.role) }));
}

/** Creates a panel account. Emails listed in ADMIN_EMAILS are always admins. */
export async function createUserAccount(input: UserInput): Promise<void> {
  await assertAdmin();
  const email = input.email.toLowerCase().trim();
  const existing = await queryOne<{ id: string }>(`SELECT id FROM users WHERE email = ?`, [
    email,
  ]);
  if (existing) throw new UserAdminError("Ya existe una cuenta con ese correo", 409);

  const role: Role = isListedAdmin(email) ? "admin" : input.role;
  await execute(
    `INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    [randomUUID(), email, input.name.trim(), hashPassword(input.password), role],
  );
}

export async function setUserRole(
  id: string,
  role: Role,
): Promise<{ selfDemoted: boolean }> {
  const actor = await assertAdmin();
  const target = await queryOne<{ id: string; role: string }>(
    `SELECT id, role FROM users WHERE id = ?`,
    [id],
  );
  if (!target) throw new UserAdminError("Ese usuario ya no existe", 404);

  if (asRole(target.role) === "admin" && role !== "admin" && (await adminCount()) <= 1) {
    throw new UserAdminError("Tiene que quedar al menos un administrador", 422);
  }

  await execute(`UPDATE users SET role = ? WHERE id = ?`, [role, id]);
  return { selfDemoted: actor.id === id && role !== "admin" };
}

export async function deleteUserAccount(id: string): Promise<void> {
  const actor = await assertAdmin();
  if (actor.id === id) {
    throw new UserAdminError("No puedes eliminar tu propia cuenta", 422);
  }

  const target = await queryOne<{ id: string; role: string }>(
    `SELECT id, role FROM users WHERE id = ?`,
    [id],
  );
  if (!target) throw new UserAdminError("Ese usuario ya no existe", 404);

  if (asRole(target.role) === "admin" && (await adminCount()) <= 1) {
    throw new UserAdminError("Tiene que quedar al menos un administrador", 422);
  }

  await execute(`DELETE FROM users WHERE id = ?`, [id]);
}
