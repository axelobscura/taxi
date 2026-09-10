"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import {
  DriverInput,
  createDriver,
  deleteDriver,
  setDriverStatus,
} from "@/lib/drivers";

export type FleetState = { error?: string; ok?: boolean };

export async function addDriver(
  _prev: FleetState,
  formData: FormData,
): Promise<FleetState> {
  const user = await currentUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a entrar." };

  const parsed = DriverInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    createDriver(parsed.data, user.id);
  } catch (err) {
    if (String(err).includes("UNIQUE")) {
      return { error: "Ya existe un conductor con esa placa" };
    }
    throw err;
  }

  revalidatePath("/flota");
  return { ok: true };
}

export async function changeStatus(id: string, status: string) {
  if (!(await currentUser())) return;
  setDriverStatus(id, status);
  revalidatePath("/flota");
}

export async function removeDriver(id: string) {
  if (!(await currentUser())) return;
  deleteDriver(id);
  revalidatePath("/flota");
}
