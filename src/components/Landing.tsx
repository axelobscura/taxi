import Link from "next/link";
import { TIERS, distanceKm, durationMin, fareFor, mxn } from "@/lib/data";
import { placeNamed, type City, type Faq } from "@/lib/cities";
import { ORG_ID, absoluteUrl, jsonLd } from "@/lib/site";

/** Building blocks shared by the `/taxi` coverage landing pages. */

export type Crumb = { href: string; label: string };

const ROSA = TIERS.find((t) => t.id === "rosa")!;

export function rosaFare(from: string, to: string) {
  const km = distanceKm(placeNamed(from), placeNamed(to));
  const min = durationMin(km);
  return { km, min, fare: fareFor(ROSA, km, min) };
}

/** The FAQ answer as shown, with the live fare prepended for price questions. */
function answerOf(faq: Faq): string {
  if (!faq.fare) return faq.a;
  const [from, to] = faq.fare;
  return `De ${from} a ${to}, en categoría Rosa, cuesta alrededor de ${mxn(
    rosaFare(from, to).fare,
  )}. ${faq.a}`;
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: answerOf(f) },
    })),
  };
}

/** A TaxiService offered in a city, or in one zone of it. */
export function taxiServiceJsonLd(
  city: City,
  path: string,
  description: string,
  zone?: string,
) {
  const cityNode = {
    "@type": "City",
    name: city.name,
    containedInPlace: { "@type": "Country", name: "México" },
  };
  return {
    "@type": "TaxiService",
    "@id": absoluteUrl(`${path}#service`),
    name: zone ? `Taxi en ${zone}, ${city.shortName}` : `Taxi en ${city.name}`,
    description,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID },
    areaServed: zone
      ? { "@type": "Place", name: zone, containedInPlace: cityNode }
      : cityNode,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl("/"),
    },
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      opens: "00:00",
      closes: "23:59",
    },
  };
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-cream">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="transition hover:text-accent">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SampleFares({ from, to }: { from: string; to: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {to.map((dest) => {
        const { km, min, fare } = rosaFare(from, dest);
        return (
          <li
            key={dest}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 border-l-2 border-taxi bg-ink-soft p-4"
          >
            <span className="min-w-0 flex-1 text-sm">
              {from} <span className="text-muted">→</span> {dest}
            </span>
            <span className="text-xs text-muted">
              {km.toFixed(1)} km · {min} min
            </span>
            <span className="font-display text-lg font-extrabold tabular-nums">
              {mxn(fare)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mt-4 space-y-2">
      {faqs.map((f) => (
        <details key={f.q} className="group bg-ink-soft p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-extrabold">
            {f.q}
            <span
              aria-hidden
              className="text-accent transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {answerOf(f)}
          </p>
        </details>
      ))}
    </div>
  );
}

export function OrderCta({ title }: { title: string }) {
  return (
    <div className="mt-12 flex flex-col items-start gap-4 border-l-2 border-taxi bg-ink-soft p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-xl font-extrabold uppercase">{title}</p>
        <p className="mt-1 text-sm text-muted">
          Elige origen y destino y ve tu tarifa cerrada al instante.
        </p>
      </div>
      <Link
        href="/"
        className="shrink-0 bg-taxi px-8 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-coal transition active:scale-[0.98]"
      >
        <span className="block">Pedir taxi</span>
      </Link>
    </div>
  );
}
