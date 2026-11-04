import Link from "next/link";
import { TIERS, distanceKm, durationMin, fareFor, mxn } from "@/lib/data";
import { placeNamed, type City, type Faq } from "@/lib/cities";
import { ORG_ID, absoluteUrl, jsonLd } from "@/lib/site";
import { localePath, type Lang } from "@/i18n/config";
import { getDict, placeLabel, type Dict } from "@/i18n/dictionaries";
import { getI18n } from "@/i18n/server";

/** Building blocks shared by the `/taxi` coverage landing pages. */

/** `href` is the public URL, already language-prefixed. */
export type Crumb = { href: string; label: string };

const ROSA = TIERS.find((t) => t.id === "rosa")!;

/** `from` and `to` are PLACES keys (Spanish names), not display labels. */
export function rosaFare(from: string, to: string) {
  const km = distanceKm(placeNamed(from), placeNamed(to));
  const min = durationMin(km);
  return { km, min, fare: fareFor(ROSA, km, min) };
}

const FARE_SENTENCE = {
  es: "De {from} a {to}, en categoría Rosa, cuesta alrededor de {fare}.",
  en: "From {from} to {to}, a Rosa ride costs about {fare}.",
} as const;

/** The FAQ answer as shown, with the live fare prepended for price questions. */
function answerOf(faq: Faq, lang: Lang, dict: Dict): string {
  if (!faq.fare) return faq.a;
  const [from, to] = faq.fare;
  const lead = FARE_SENTENCE[lang]
    .replace("{from}", placeLabel(dict, from))
    .replace("{to}", placeLabel(dict, to))
    .replace("{fare}", mxn(rosaFare(from, to).fare));
  return `${lead} ${faq.a}`;
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

export function faqJsonLd(faqs: Faq[], lang: Lang) {
  const dict = getDict(lang);
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: answerOf(f, lang, dict) },
    })),
  };
}

/**
 * A TaxiService offered in a city, or in one zone of it. `city` must already
 * be localized; `path` is language-neutral.
 */
export function taxiServiceJsonLd(
  city: City,
  lang: Lang,
  path: string,
  description: string,
  zone?: string,
) {
  const url = localePath(lang, path);
  const cityNode = {
    "@type": "City",
    name: city.name,
    containedInPlace: { "@type": "Country", name: lang === "es" ? "México" : "Mexico" },
  };
  const taxiIn = lang === "es" ? "Taxi en" : "Taxi in";
  return {
    "@type": "TaxiService",
    "@id": absoluteUrl(`${url}#service`),
    name: zone ? `${taxiIn} ${zone}, ${city.shortName}` : `${taxiIn} ${city.name}`,
    description,
    url: absoluteUrl(url),
    inLanguage: lang,
    provider: { "@id": ORG_ID },
    areaServed: zone
      ? { "@type": "Place", name: zone, containedInPlace: cityNode }
      : cityNode,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(localePath(lang, "/")),
    },
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      opens: "00:00",
      closes: "23:59",
    },
  };
}

export async function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const { lang } = await getI18n();
  return (
    <nav aria-label={lang === "es" ? "Ruta de navegación" : "Breadcrumb"} className="mb-4">
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

export async function SampleFares({ from, to }: { from: string; to: string[] }) {
  const { dict } = await getI18n();
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
              {placeLabel(dict, from)} <span className="text-muted">→</span>{" "}
              {placeLabel(dict, dest)}
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

export async function FaqList({ faqs }: { faqs: Faq[] }) {
  const { lang, dict } = await getI18n();
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
            {answerOf(f, lang, dict)}
          </p>
        </details>
      ))}
    </div>
  );
}

const CTA = {
  es: { body: "Elige origen y destino y ve tu tarifa cerrada al instante.", button: "Pedir taxi" },
  en: { body: "Pick your pickup and drop-off and see your fixed fare instantly.", button: "Book a taxi" },
} as const;

export async function OrderCta({ title }: { title: string }) {
  const { lang } = await getI18n();
  return (
    <div className="mt-12 flex flex-col items-start gap-4 border-l-2 border-taxi bg-ink-soft p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-xl font-extrabold uppercase">{title}</p>
        <p className="mt-1 text-sm text-muted">{CTA[lang].body}</p>
      </div>
      <Link
        href={`${localePath(lang, "/")}#pedir`}
        className="shrink-0 rounded-md bg-taxi px-8 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-coal transition hover:bg-taxi-bright active:scale-[0.98]"
      >
        {CTA[lang].button}
      </Link>
    </div>
  );
}
