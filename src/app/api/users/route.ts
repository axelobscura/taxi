import { NextResponse } from "next/server";
import { UserInput, createUserAccount, listUserAccounts, userAdminError } from "@/lib/users";

function refused(err: unknown) {
  const adminErr = userAdminError(err);
  if (!adminErr) return null;
  return NextResponse.json({ error: adminErr.message }, { status: adminErr.status });
}

export async function GET() {
  try {
    return NextResponse.json({ users: await listUserAccounts() });
  } catch (err) {
    const response = refused(err);
    if (response) return response;
    throw err;
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = UserInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    await createUserAccount(parsed.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    const response = refused(err);
    if (response) return response;
    throw err;
  }
}
