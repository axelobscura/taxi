import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { DriverInput, createDriver, listDrivers } from "@/lib/drivers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const tier = url.searchParams.get("tier") ?? undefined;
  return NextResponse.json({ drivers: listDrivers({ status, tier }) });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = DriverInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const driver = createDriver(parsed.data, user.id);
    return NextResponse.json({ driver }, { status: 201 });
  } catch (err) {
    // The plate column is UNIQUE.
    if (String(err).includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Ya existe un conductor con esa placa" },
        { status: 409 },
      );
    }
    throw err;
  }
}
