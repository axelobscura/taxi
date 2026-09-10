import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  PLACES,
  TIERS,
  distanceKm,
  durationMin,
  fareFor,
  mxn,
} from "@/lib/data";

export const metadata = {
  title: "Tarifas · TAXI_MEX",
  description:
    "Cómo se calcula la tarifa: banderazo, costo por kilómetro y por minuto. Ejemplos de rutas reales en la CDMX.",
};

const place = (name: string) => PLACES.find((p) => p.name === name)!;

/** Representative routes across the city, priced with the real formula. */
const ROUTES = [
  ["Ángel de la Independencia", "Aeropuerto AICM T1"],
  ["Zócalo", "Coyoacán Centro"],
  ["Polanco", "Santa Fe"],
  ["Parque México", "Ciudad Universitaria"],
  ["Terminal Norte", "Bosque de Chapultepec"],
] as const;

export default function TarifasPage() {
  return (
    <PageShell
      eyebrow="Precios claros"
      title={<>Tarifa cerrada,<br />sin sorpresas</>}
      lead="Ves el precio antes de confirmar y ese es el que pagas. No cobramos por tráfico imprevisto ni aplicamos tarifa dinámica."
    >
      <section>
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Cómo se calcula
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Formula
            n="01"
            title="Banderazo"
            body="Cargo fijo al iniciar el viaje. Cambia según la categoría."
          />
          <Formula
            n="02"
            title="Por kilómetro"
            body="Distancia estimada de la ruta entre origen y destino."
          />
          <Formula
            n="03"
            title="Por minuto"
            body="Tiempo estimado con el tráfico promedio de la ciudad (18 km/h)."
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Comparativa por categoría
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-rosa text-left">
                <Th>Categoría</Th>
                <Th align="right">Banderazo</Th>
                <Th align="right">Por km</Th>
                <Th align="right">Por min</Th>
                <Th align="right">Plazas</Th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t.id} className="border-b border-ink-line">
                  <Td>
                    <span className="font-display font-extrabold uppercase">
                      {t.name}
                    </span>
                  </Td>
                  <Td align="right">{mxn(t.base)}</Td>
                  <Td align="right">{mxn(t.perKm)}</Td>
                  <Td align="right">{mxn(t.perMin)}</Td>
                  <Td align="right">{t.seats}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Rutas de ejemplo
        </h2>
        <p className="mt-1 text-sm text-muted">
          Precios estimados en categoría Rosa, calculados con la misma fórmula
          que usa la app.
        </p>

        <ul className="mt-4 space-y-2">
          {ROUTES.map(([from, to]) => {
            const km = distanceKm(place(from), place(to));
            const min = durationMin(km);
            const rosa = TIERS.find((t) => t.id === "rosa")!;
            return (
              <li
                key={`${from}-${to}`}
                className="cut-tr flex flex-wrap items-center gap-x-4 gap-y-1 border-l-2 border-rosa bg-ink-soft p-4"
              >
                <span className="min-w-0 flex-1 text-sm">
                  {from} <span className="text-muted">→</span> {to}
                </span>
                <span className="text-xs text-muted">
                  {km.toFixed(1)} km · {min} min
                </span>
                <span className="font-display text-lg font-extrabold tabular-nums">
                  {mxn(fareFor(rosa, km, min))}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Las distancias son estimadas en línea directa con un factor de rodeo;
          la tarifa final puede variar si el trayecto real cambia. Las casetas
          de la autopista no están incluidas.
        </p>
      </section>

      <div className="mt-10 flex flex-col items-start gap-4 border-l-2 border-rosa bg-ink-soft p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-xl font-extrabold uppercase">
          Calcula tu viaje
        </p>
        <Link
          href="/"
          className="skewed-btn glow-rosa shrink-0 bg-rosa px-8 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-white transition active:scale-[0.98]"
        >
          <span className="block">Ver mi tarifa</span>
        </Link>
      </div>
    </PageShell>
  );
}

function Formula({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="cut-tr bg-ink-soft p-5">
      <span className="font-display text-[11px] font-bold text-rosa">{n}</span>
      <h3 className="mt-1 font-display text-base font-extrabold uppercase">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      className={`px-3 py-3 tabular-nums ${align === "right" ? "text-right" : ""}`}
    >
      {children}
    </td>
  );
}
