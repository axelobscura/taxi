"use server";

import { z } from "zod";

/**
 * `error` is a field key rather than a message, so the form can show it in
 * the page's language (Server Actions can't read the route's language).
 */
export type ContactError = "name" | "email" | "body" | "invalid";
export type ContactState = { error?: ContactError; ok?: boolean };

const Message = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  subject: z.enum(["viaje", "factura", "conductor", "otro"]),
  body: z.string().trim().min(10).max(2000),
});

const FIELD_ERRORS = new Set<ContactError>(["name", "email", "body"]);

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = Message.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const field = parsed.error.issues[0].path[0] as ContactError;
    return { error: FIELD_ERRORS.has(field) ? field : "invalid" };
  }

  // No mail provider is wired up yet, so the message is logged server-side.
  // Swap this for the transactional email or ticketing call when available.
  console.log("[contacto]", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return { ok: true };
}
