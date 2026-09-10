import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { deleteDriver, setDriverStatus } from "@/lib/drivers";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const { status } = (await req.json()) as { status?: string };

  if (!status || !["available", "busy", "offline"].includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 422 });
  }

  setDriverStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  deleteDriver(id);
  return NextResponse.json({ ok: true });
}
