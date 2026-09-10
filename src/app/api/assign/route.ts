import { NextResponse } from "next/server";
import { assignDriver } from "@/lib/drivers";

/**
 * Assign an available driver for a tier. Called by the booking flow when the
 * rider confirms a ride.
 */
export async function POST(req: Request) {
  const { tier, lat, lng } = (await req.json()) as {
    tier?: string;
    lat?: number;
    lng?: number;
  };

  if (!tier) {
    return NextResponse.json({ error: "Falta el servicio" }, { status: 422 });
  }

  const near =
    typeof lat === "number" && typeof lng === "number" ? { lat, lng } : undefined;
  const driver = assignDriver(tier, near);

  if (!driver) {
    return NextResponse.json(
      { error: "No hay conductores disponibles para este servicio" },
      { status: 404 },
    );
  }

  return NextResponse.json({ driver });
}
