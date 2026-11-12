"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  UserInput,
  createUserAccount,
  deleteUserAccount,
  setUserRole,
  userAdminError,
} from "@/lib/users";

export type AdminState = { error?: string; ok?: boolean };

function failure(err: unknown): AdminState | null {
  const adminErr = userAdminError(err);
  return adminErr ? { error: adminErr.message } : null;
}

export async function addUser(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const parsed = UserInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await createUserAccount(parsed.data);
  } catch (err) {
    const refused = failure(err);
    if (refused) return refused;
    throw err;
  }

  revalidatePath("/flota/usuarios");
  return { ok: true };
}

const RoleChange = z.object({
  id: z.string().uuid(),
  role: z.enum(["operator", "admin"]),
});

export async function changeRole(id: string, role: string): Promise<AdminState> {
  const parsed = RoleChange.safeParse({ id, role });
  if (!parsed.success) return { error: "No se pudo cambiar el rol" };

  try {
    const result = await setUserRole(parsed.data.id, parsed.data.role);
    revalidatePath("/flota/usuarios");
    if (result.selfDemoted) redirect("/flota");
  } catch (err) {
    const refused = failure(err);
    if (refused) return refused;
    throw err;
  }

  return {};
}

export async function removeUser(id: string): Promise<AdminState> {
  if (!z.string().uuid().safeParse(id).success) {
    return { error: "No se pudo eliminar la cuenta" };
  }

  try {
    await deleteUserAccount(id);
  } catch (err) {
    const refused = failure(err);
    if (refused) return refused;
    throw err;
  }

  revalidatePath("/flota/usuarios");
  return {};
}
