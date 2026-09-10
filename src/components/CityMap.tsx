"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Layer } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Place } from "@/lib/data";

type Props = {
  origin: Place | null;
  destination: Place | null;
  /** Animates a car along the route once a ride is confirmed. */
  driving?: boolean;
};

/** Centre of Mexico City, used before either point is chosen. */
const CDMX: [number, number] = [19.4326, -99.1332];

/**
 * Bend a straight line into a gentle arc so the route reads as a path
 * rather than a ruler line. Offsets the midpoint perpendicular to the
 * origin-to-destination vector.
 */
function arc(
  a: [number, number],
  b: [number, number],
  bend = 0.16,
  steps = 64,
): [number, number][] {
  const [y1, x1] = a;
  const [y2, x2] = b;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    // Quadratic Bezier through the offset control point.
    pts.push([
      u * u * y1 + 2 * u * t * my + t * t * y2,
      u * u * x1 + 2 * u * t * mx + t * t * x2,
    ]);
  }
  return pts;
}

export default function CityMap({ origin, destination, driving = false }: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const overlays = useRef<Layer[]>([]);
  const carFrame = useRef<number | null>(null);

  // Create the map once, on the client only.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !holder.current || map.current) return;

      const m = L.map(holder.current, {
        center: CDMX,
        zoom: 12,
        zoomControl: false,
        attributionControl: true,
      });

      // Esri's dark canvas: no API key, no watermark, and dark enough that
      // the pink route reads clearly on top of it.
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 16,
          attribution:
            '&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, &copy; OpenStreetMap contributors',
        },
      ).addTo(m);

      // Street and place labels ride above the base layer.
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16, opacity: 0.85 },
      ).addTo(m);

      map.current = m;
    })();

    return () => {
      cancelled = true;
      if (carFrame.current) cancelAnimationFrame(carFrame.current);
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Redraw markers and route whenever the trip changes.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      const m = map.current;
      if (cancelled || !m) return;

      overlays.current.forEach((l) => m.removeLayer(l));
      overlays.current = [];
      if (carFrame.current) cancelAnimationFrame(carFrame.current);

      const pin = (kind: "origin" | "dest") =>
        L.divIcon({
          className: "",
          html:
            kind === "origin"
              ? `<span class="map-dot"></span>`
              : `<span class="map-pin"></span>`,
          iconSize: kind === "origin" ? [18, 18] : [22, 30],
          iconAnchor: kind === "origin" ? [9, 9] : [11, 30],
        });

      if (origin) {
        const mk = L.marker([origin.lat, origin.lng], {
          icon: pin("origin"),
          keyboard: false,
        }).addTo(m);
        overlays.current.push(mk);
      }

      if (destination) {
        const mk = L.marker([destination.lat, destination.lng], {
          icon: pin("dest"),
          keyboard: false,
        }).addTo(m);
        overlays.current.push(mk);
      }

      if (origin && destination) {
        const path = arc(
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        );

        // Wide soft stroke underneath, crisp stroke on top.
        const halo = L.polyline(path, {
          color: "#ff2d78",
          weight: 12,
          opacity: 0.18,
          lineCap: "round",
        }).addTo(m);
        const line = L.polyline(path, {
          color: "#ff2d78",
          weight: 4,
          opacity: 0.95,
          lineCap: "round",
        }).addTo(m);
        overlays.current.push(halo, line);

        if (driving) {
          const car = L.marker(path[0], {
            icon: L.divIcon({
              className: "",
              html: `<span class="map-car"></span>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            }),
            keyboard: false,
          }).addTo(m);
          overlays.current.push(car);

          const started = performance.now();
          const loop = (now: number) => {
            const t = ((now - started) / 9000) % 1;
            const i = Math.floor(t * (path.length - 1));
            car.setLatLng(path[i]);
            carFrame.current = requestAnimationFrame(loop);
          };
          carFrame.current = requestAnimationFrame(loop);
        }

        // Keep the route in the upper band, clear of the booking sheet.
        m.fitBounds(L.latLngBounds(path), {
          paddingTopLeft: [40, 60],
          paddingBottomRight: [40, 380],
          animate: true,
          duration: 0.8,
        });
      } else if (origin || destination) {
        const p = (origin ?? destination)!;
        // Offset the centre south so the marker rises above the sheet.
        const b = L.latLngBounds(
          [p.lat - 0.004, p.lng - 0.02],
          [p.lat + 0.004, p.lng + 0.02],
        );
        m.fitBounds(b, {
          paddingTopLeft: [30, 40],
          paddingBottomRight: [30, 400],
          animate: true,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [origin, destination, driving]);

  return (
    <div className="absolute inset-0">
      <div ref={holder} className="h-full w-full" />
      {/* Vignette keeps the booking sheet legible over the map. */}
      <div className="pointer-events-none absolute inset-0 z-[500] bg-[radial-gradient(ellipse_at_50%_30%,transparent_40%,rgba(11,11,15,0.7)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] h-1/2 bg-gradient-to-t from-ink via-ink/92 to-transparent" />
    </div>
  );
}
