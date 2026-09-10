"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import SiteHeader from "@/components/SiteHeader";
import PlacePicker from "@/components/PlacePicker";
import TierSelect from "@/components/TierSelect";
import DriverCard from "@/components/DriverCard";
// Leaflet touches `window` on import, so it must never render on the server.
const CityMap = dynamic(() => import("@/components/CityMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-ink" />,
});

import {
  type AssignedDriver,
  PLACES,
  TIERS,
  type Place,
  type TierId,
  distanceKm,
  durationMin,
  fareFor,
  mxn,
} from "@/lib/data";

type Stage = "search" | "confirm" | "riding";

export default function Home() {
  const [origin, setOrigin] = useState<Place | null>(PLACES[1]);
  const [destination, setDestination] = useState<Place | null>(null);
  const [tierId, setTierId] = useState<TierId>("rosa");
  const [stage, setStage] = useState<Stage>("search");
  const [driver, setDriver] = useState<AssignedDriver | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  const tier = TIERS.find((t) => t.id === tierId)!;

  const trip = useMemo(() => {
    if (!origin || !destination) return null;
    const km = distanceKm(origin, destination);
    const min = durationMin(km);
    return { km, min, fare: fareFor(tier, km, min) };
  }, [origin, destination, tier]);

  function pick(field: "origin" | "destination", place: Place) {
    if (field === "origin") setOrigin(place);
    else setDestination(place);
  }

  function swap() {
    setOrigin(destination);
    setDestination(origin);
  }

  async function confirm() {
    if (!origin) return;
    setAssigning(true);
    setAssignError(null);
    try {
      const res = await fetch("/api/assign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier: tierId, lat: origin.lat, lng: origin.lng }),
      });
      const body = await res.json();
      if (!res.ok) {
        setAssignError(body.error ?? "No se pudo asignar un conductor");
        return;
      }
      setDriver(body.driver);
      setStage("riding");
    } catch {
      setAssignError("Error de conexión. Intenta de nuevo.");
    } finally {
      setAssigning(false);
    }
  }

  function reset() {
    setStage("search");
    setDestination(null);
    setDriver(null);
    setAssignError(null);
  }

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="fixed inset-0">
        <CityMap
          origin={origin}
          destination={destination}
          driving={stage === "riding"}
        />
      </div>

      <SiteHeader floating />

      <div className="relative z-10 mt-auto max-h-dvh w-full overflow-y-auto no-scrollbar px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4 sm:px-5 sm:pb-5">
        {/* Solid backing so map labels never collide with sheet text. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-8 -z-10" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-10 bg-gradient-to-b from-transparent to-ink" />
        <div className="mx-auto w-full max-w-md space-y-3">
          {stage === "search" && (
            <>
              <Hero hasTrip={!!trip} />
              <PlacePicker
                origin={origin}
                destination={destination}
                onPick={pick}
                onSwap={swap}
              />
              {trip && (
                <button
                  type="button"
                  onClick={() => setStage("confirm")}
                  className="skewed-btn glow-rosa w-full bg-rosa py-4 font-display text-sm font-extrabold uppercase tracking-widest text-white transition active:scale-[0.98]"
                >
                  <span className="block">Ver opciones · {trip.min} min</span>
                </button>
              )}
            </>
          )}

          {stage === "confirm" && trip && (
            <div className="animate-rise space-y-3">
              <TripSummary
                origin={origin!}
                destination={destination!}
                km={trip.km}
                min={trip.min}
                onBack={() => setStage("search")}
              />
              <p className="eyebrow px-1 pt-1">Elige tu servicio</p>
              <TierSelect
                selected={tierId}
                onSelect={setTierId}
                km={trip.km}
                min={trip.min}
              />
              <button
                type="button"
                onClick={confirm}
                disabled={assigning}
                className="skewed-btn glow-rosa w-full bg-rosa py-4 font-display text-sm font-extrabold uppercase tracking-widest text-white transition active:scale-[0.98] disabled:opacity-60"
              >
                <span className="block">
                  {assigning
                    ? "Buscando conductor…"
                    : `Pedir ${tier.name} · ${mxn(trip.fare)}`}
                </span>
              </button>
              {assignError && (
                <p
                  role="alert"
                  className="border-l-2 border-rosa bg-rosa/10 px-3 py-2 text-sm text-rosa"
                >
                  {assignError}
                </p>
              )}
            </div>
          )}

          {stage === "riding" && trip && driver && (
            <DriverCard
              driver={driver}
              tier={tier}
              fare={trip.fare}
              onCancel={reset}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function Hero({ hasTrip }: { hasTrip: boolean }) {
  if (hasTrip) return null;
  return (
    <div className="animate-rise px-1 pb-3 pt-12 max-[760px]:pt-4">
      <p className="eyebrow mb-3">Pide tu taxi en línea</p>
      <h1 className="font-display text-[2.6rem] font-extrabold uppercase leading-[0.98] tracking-tight">
        Taxi seguro
        <br />
        <span className="skewed ml-2 mt-1.5 inline-block bg-cream px-3 py-0.5">
          <span className="block text-ink">al instante</span>
        </span>
      </h1>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
        Conductores verificados en toda la CDMX. Tarifa cerrada antes de
        subir, sin sorpresas.
      </p>
    </div>
  );
}

function TripSummary({
  origin,
  destination,
  km,
  min,
  onBack,
}: {
  origin: Place;
  destination: Place;
  km: number;
  min: number;
  onBack: () => void;
}) {
  return (
    <div className="glass cut-tr flex items-center gap-3 border-l-2 border-rosa p-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Volver"
        className="grid size-10 shrink-0 place-items-center border-2 border-ink-line bg-ink-raised text-muted transition hover:border-rosa hover:text-rosa active:scale-90"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {origin.name} <span className="text-muted">→</span> {destination.name}
        </p>
        <p className="text-xs text-muted">
          {km.toFixed(1)} km · aprox. {min} min con tráfico
        </p>
      </div>
    </div>
  );
}
