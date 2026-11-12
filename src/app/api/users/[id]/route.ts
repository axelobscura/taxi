import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteUserAccount, setUserRole, userAdminError } from "@/lib/users";

type Ctx = { params: Promise<{ id: string }> };

const RoleChange = z.object({
  role: z.enum(["operator", "admin"]),
});

function refused(err: unknown) {
  const adminErr = userAdminError(err);
  if (!adminErr) return null;
  return NextResponse.json({ error: adminErr.message }, { status: adminErr.status });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Usuario inválido" }, { status: 422 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = RoleChange.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 422 });
  }

  try {
    await setUserRole(id, parsed.data.role);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const response = refused(err);
    if (response) return response;
    throw err;
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Usuario inválido" }, { status: 422 });
  }

  try {
    await deleteUserAccount(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const response = refused(err);
    if (response) return response;
    throw err;
  }
}
