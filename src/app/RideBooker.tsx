"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import PlacePicker from "@/components/PlacePicker";
import TierSelect from "@/components/TierSelect";
import DriverCard from "@/components/DriverCard";
import { track } from "@/lib/analytics";
// Leaflet touches `window` on import, so it must never render on the server.
const CityMap = dynamic(() => import("@/components/CityMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-coal" />,
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

export default function RideBooker() {
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

  function viewOptions() {
    if (!trip) return;
    track("view_options", {
      origin: origin?.name,
      destination: destination?.name,
      distance_km: Math.round(trip.km),
    });
    setStage("confirm");
  }

  function selectTier(id: TierId) {
    track("select_tier", { tier: id });
    setTierId(id);
  }

  async function confirm() {
    if (!origin || !trip) return;
    // `value` + `currency` let GA4 report estimated booking revenue.
    const ride = { tier: tierId, value: trip.fare, currency: "MXN" };
    track("request_ride", ride);
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
        track("ride_assign_failed", { tier: tierId, status: res.status });
        return;
      }
      track("ride_assigned", ride);
      setDriver(body.driver);
      setStage("riding");
    } catch {
      setAssignError("Error de conexión. Intenta de nuevo.");
      track("ride_assign_failed", { tier: tierId, status: "network" });
    } finally {
      setAssigning(false);
    }
  }

  function reset() {
    if (stage === "riding") track("ride_cancel", { tier: tierId });
    setStage("search");
    setDestination(null);
    setDriver(null);
    setAssignError(null);
  }

  return (
    <div className="theme-light card-shadow overflow-hidden rounded-lg">
      <div className="bg-coal px-5 py-4">
        <h2 className="font-display text-xl font-black uppercase text-snow">
          Pide un <span className="text-taxi">taxi</span>
        </h2>
      </div>

      {/* The live map: route preview, then the car driving it. */}
      <div className="relative h-48 bg-coal sm:h-56">
        <CityMap
          origin={origin}
          destination={destination}
          driving={stage === "riding"}
        />
      </div>

      <div className="space-y-3 p-4">
        {stage === "search" && (
          <>
            <PlacePicker
              origin={origin}
              destination={destination}
              onPick={pick}
              onSwap={swap}
            />
            {trip && (
              <button
                type="button"
                onClick={viewOptions}
                className="w-full rounded-md bg-coal py-4 font-display text-sm font-extrabold uppercase tracking-widest text-snow transition hover:bg-coal/85 active:scale-[0.98]"
              >
                Ver opciones · {trip.min} min
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
              onSelect={selectTier}
              km={trip.km}
              min={trip.min}
            />
            <button
              type="button"
              onClick={confirm}
              disabled={assigning}
              className="w-full rounded-md bg-taxi py-4 font-display text-sm font-extrabold uppercase tracking-widest text-coal transition hover:bg-taxi-bright active:scale-[0.98] disabled:opacity-60"
            >
              {assigning
                ? "Buscando conductor…"
                : `Pedir ${tier.name} · ${mxn(trip.fare)}`}
            </button>
            {assignError && (
              <p
                role="alert"
                className="border-l-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-700"
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
    <div className="glass flex items-center gap-3 border-l-2 border-taxi p-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Volver"
        className="grid size-10 shrink-0 place-items-center border-2 border-ink-line bg-ink-raised text-muted transition hover:border-taxi hover:text-accent active:scale-90"
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
