import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { JsonLd, OrderCta, breadcrumbJsonLd } from "@/components/Landing";
import { CITIES } from "@/lib/cities";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/taxi",
  "Taxi en México: ciudades y zonas con servicio",
  "Consulta dónde opera TAXI-MEX: taxis seguros con tarifa cerrada en la Ciudad de México, el aeropuerto AICM y las centrales de autobuses.",
);

const CRUMBS = [
  { href: "/", label: "Inicio" },
  { href: "/taxi", label: "Cobertura" },
];

export default function CoberturaPage() {
  return (
    <PageShell
      crumbs={CRUMBS}
      eyebrow="Cobertura"
      title={<>Taxi seguro<br />en México</>}
      lead="Estas son las ciudades y zonas donde puedes pedir un taxi con nosotros. Seguimos creciendo: cada ciudad nueva aparecerá aquí en cuanto el servicio esté activo."
    >
      <JsonLd
        data={{ "@context": "https://schema.org", ...breadcrumbJsonLd(CRUMBS) }}
      />

      <div className="space-y-10">
        {CITIES.map((city) => (
          <section key={city.slug}>
            <h2 className="font-display text-2xl font-extrabold uppercase">
              <Link
                href={`/taxi/${city.slug}`}
                className="transition hover:text-accent"
              >
                Taxi en {city.name}
              </Link>
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {city.intro}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {city.zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={`/taxi/${city.slug}/${z.slug}`}
                    className="block border-l-2 border-taxi bg-ink-soft p-4 transition hover:bg-ink-raised"
                  >
                    <span className="font-display text-base font-extrabold">
                      Taxi en {z.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {z.tagline}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <OrderCta title="Pide tu taxi ahora" />
    </PageShell>
  );
}
