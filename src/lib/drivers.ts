import { randomUUID } from "node:crypto";
import { z } from "zod";
import { execute, query, queryOne } from "@/lib/db";
import { TIERS } from "@/lib/data";
import "server-only";

const TIER_IDS = TIERS.map((t) => t.id) as [string, ...string[]];

export const DriverInput = z.object({
  name: z.string().trim().min(3, "Nombre demasiado corto").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]{8,20}$/, "Teléfono inválido"),
  car_make: z.string().trim().min(2, "Marca requerida").max(40),
  car_model: z.string().trim().min(1, "Modelo requerido").max(40),
  car_color: z.string().trim().min(3, "Color requerido").max(30),
  // CDMX plates look like ABC-12-34 or A12-BCD; keep it permissive but bounded.
  plate: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{5,12}$/, "Placa inválida"),
  seats: z.coerce.number().int().min(2).max(8),
  tier: z.enum(TIER_IDS),
  status: z.enum(["available", "busy", "offline"]).default("available"),
  lat: z.coerce.number().min(-90).max(90).nullable().optional(),
  lng: z.coerce.number().min(-180).max(180).nullable().optional(),
});

export type DriverInput = z.infer<typeof DriverInput>;

export type DriverRow = {
  id: string;
  name: string;
  phone: string;
  car_make: string;
  car_model: string;
  car_color: string;
  plate: string;
  seats: number;
  tier: string;
  status: string;
  rating: number;
  trips: number;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

export function listDrivers(filter?: {
  status?: string;
  tier?: string;
}): Promise<DriverRow[]> {
  const where: string[] = [];
  const args: string[] = [];

  if (filter?.status) {
    where.push("status = ?");
    args.push(filter.status);
  }
  if (filter?.tier) {
    where.push("tier = ?");
    args.push(filter.tier);
  }

  const sql = `SELECT * FROM drivers ${
    where.length ? `WHERE ${where.join(" AND ")}` : ""
  } ORDER BY status = 'available' DESC, rating DESC, created_at DESC`;

  return query<DriverRow>(sql, args);
}

export async function createDriver(input: DriverInput, userId: string): Promise<DriverRow> {
  const id = randomUUID();
  await execute(
    `INSERT INTO drivers
       (id, name, phone, car_make, car_model, car_color, plate, seats,
        tier, status, lat, lng, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.name,
      input.phone,
      input.car_make,
      input.car_model,
      input.car_color,
      input.plate,
      input.seats,
      input.tier,
      input.status,
      input.lat ?? null,
      input.lng ?? null,
      userId,
    ],
  );
  return (await queryOne<DriverRow>(`SELECT * FROM drivers WHERE id = ?`, [id]))!;
}

export async function setDriverStatus(id: string, status: string): Promise<void> {
  await execute(`UPDATE drivers SET status = ? WHERE id = ?`, [status, id]);
}

export async function deleteDriver(id: string): Promise<void> {
  await execute(`DELETE FROM drivers WHERE id = ?`, [id]);
}

/**
 * Pick an available driver for a tier, preferring the closest one when the
 * pickup point is known. Falls back to any available driver.
 */
export async function assignDriver(
  tier: string,
  near?: { lat: number; lng: number },
): Promise<DriverRow | null> {
  const pool = await query<DriverRow>(
    `SELECT * FROM drivers WHERE status = 'available' AND tier = ?
     ORDER BY rating DESC`,
    [tier],
  );

  if (pool.length === 0) return null;
  if (!near) return pool[0];

  const located = pool.filter((d) => d.lat !== null && d.lng !== null);
  if (located.length === 0) return pool[0];

  // Squared euclidean distance is enough to rank candidates.
  return located.reduce((best, d) => {
    const dist = (x: DriverRow) =>
      (x.lat! - near.lat) ** 2 + (x.lng! - near.lng) ** 2;
    return dist(d) < dist(best) ? d : best;
  }, located[0]);
}
