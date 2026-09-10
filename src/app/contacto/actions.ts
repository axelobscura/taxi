"use server";

import { z } from "zod";

export type ContactState = { error?: string; ok?: boolean };

const Message = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(80),
  email: z.string().trim().email("Correo inválido"),
  subject: z.enum(["viaje", "factura", "conductor", "otro"]),
  body: z.string().trim().min(10, "Cuéntanos un poco más").max(2000),
});

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = Message.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // No mail provider is wired up yet, so the message is logged server-side.
  // Swap this for the transactional email or ticketing call when available.
  console.log("[contacto]", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return { ok: true };
}
