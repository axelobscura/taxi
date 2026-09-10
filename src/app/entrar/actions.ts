"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createUser,
  endSession,
  findUserByEmail,
  startSession,
  verifyPassword,
} from "@/lib/auth";

export type AuthState = { error?: string };

const Credentials = z.object({
  email: z.string().trim().email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const Registration = Credentials.extend({
  name: z.string().trim().min(2, "Nombre requerido").max(80),
});

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = Credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const user = findUserByEmail(parsed.data.email);
  // Same message either way, so the form does not reveal which emails exist.
  if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
    return { error: "Correo o contraseña incorrectos" };
  }

  await startSession(user.id);
  redirect("/flota");
}

export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = Registration.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (findUserByEmail(parsed.data.email)) {
    return { error: "Ya existe una cuenta con ese correo" };
  }

  const user = createUser(parsed.data.email, parsed.data.name, parsed.data.password);
  await startSession(user.id);
  redirect("/flota");
}

export async function logout() {
  await endSession();
  redirect("/entrar");
}
