/** Ride tiers offered in CDMX, cheapest first. */
export type TierId = "rosa" | "confort" | "xl" | "eco";

export type Tier = {
  id: TierId;
  name: string;
  tagline: string;
  /** Base fare in MXN (banderazo). */
  base: number;
  /** MXN per kilometre. */
  perKm: number;
  /** MXN per minute of travel time. */
  perMin: number;
  seats: number;
  /** Minutes until pickup. */
  eta: number;
  accent: string;
};

export const TIERS: Tier[] = [
  {
    id: "eco",
    name: "Eco",
    tagline: "El más económico",
    base: 12,
    perKm: 6.5,
    perMin: 1.4,
    seats: 4,
    eta: 6,
    accent: "jade",
  },
  {
    id: "rosa",
    name: "Rosa",
    tagline: "Nuestro clásico de la ciudad",
    base: 15,
    perKm: 8,
    perMin: 1.8,
    seats: 4,
    eta: 3,
    accent: "rosa",
  },
  {
    id: "confort",
    name: "Confort",
    tagline: "Autos nuevos, más espacio",
    base: 24,
    perKm: 11,
    perMin: 2.4,
    seats: 4,
    eta: 5,
    accent: "violet",
  },
  {
    id: "xl",
    name: "XL",
    tagline: "Hasta 6 pasajeros",
    base: 32,
    perKm: 14,
    perMin: 2.9,
    seats: 6,
    eta: 8,
    accent: "gold",
  },
];

export type Place = {
  name: string;
  zone: string;
  lat: number;
  lng: number;
};

/** Popular CDMX pickup and destination points, with real coordinates. */
export const PLACES: Place[] = [
  { name: "Zócalo", zone: "Centro Histórico", lat: 19.4326, lng: -99.1332 },
  { name: "Ángel de la Independencia", zone: "Juárez", lat: 19.4270, lng: -99.1677 },
  { name: "Parque México", zone: "Condesa", lat: 19.4113, lng: -99.1710 },
  { name: "Plaza Río de Janeiro", zone: "Roma Norte", lat: 19.4200, lng: -99.1616 },
  { name: "Aeropuerto AICM T1", zone: "Venustiano Carranza", lat: 19.4361, lng: -99.0719 },
  { name: "Aeropuerto AICM T2", zone: "Venustiano Carranza", lat: 19.4215, lng: -99.0854 },
  { name: "Bosque de Chapultepec", zone: "Miguel Hidalgo", lat: 19.4204, lng: -99.1817 },
  { name: "Coyoacán Centro", zone: "Coyoacán", lat: 19.3500, lng: -99.1620 },
  { name: "Ciudad Universitaria", zone: "Coyoacán", lat: 19.3320, lng: -99.1870 },
  { name: "Basílica de Guadalupe", zone: "Gustavo A. Madero", lat: 19.4845, lng: -99.1177 },
  { name: "Santa Fe", zone: "Cuajimalpa", lat: 19.3660, lng: -99.2730 },
  { name: "Polanco", zone: "Miguel Hidalgo", lat: 19.4333, lng: -99.1900 },
  { name: "Xochimilco", zone: "Xochimilco", lat: 19.2570, lng: -99.1030 },
  { name: "Arena Ciudad de México", zone: "Azcapotzalco", lat: 19.5030, lng: -99.1960 },
  { name: "Estadio Azteca", zone: "Coyoacán", lat: 19.3029, lng: -99.1505 },
  { name: "Terminal Norte", zone: "Gustavo A. Madero", lat: 19.4790, lng: -99.1400 },
  { name: "Insurgentes Sur", zone: "Del Valle", lat: 19.3760, lng: -99.1780 },
  { name: "Mercado de La Merced", zone: "Venustiano Carranza", lat: 19.4256, lng: -99.1246 },
];

/** A driver as returned by the assignment endpoint. */
export type AssignedDriver = {
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
};

/** Initials for the avatar, from the first two words of the name. */
export function initialsOf(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

/**
 * Great-circle distance in kilometres between two points.
 * Multiplied by a detour factor, since streets are never straight lines.
 */
export function distanceKm(a: Place, b: Place): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const straight = 2 * R * Math.asin(Math.sqrt(h));
  return Math.max(1.2, straight * 1.35);
}

/** Travel time in minutes, assuming CDMX traffic averages ~18 km/h. */
export function durationMin(km: number): number {
  return Math.round((km / 18) * 60);
}

export function fareFor(tier: Tier, km: number, min: number): number {
  return Math.round(tier.base + km * tier.perKm + min * tier.perMin);
}

export const mxn = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
