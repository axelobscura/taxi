import Link from "next/link";
import RideBooker from "./RideBooker";
import SiteHeader from "@/components/SiteHeader";
import TaxiIllustration from "@/components/TaxiIllustration";
import CarIcon from "@/components/CarIcon";
import { SiteFooter } from "@/components/PageShell";
import { JsonLd, rosaFare, taxiServiceJsonLd } from "@/components/Landing";
import { citiesIn } from "@/lib/cities";
import { TIERS, mxn, mxnRate } from "@/lib/data";
import { SITE, pageMetadata, siteDescription } from "@/lib/site";
import { localePath, type Lang } from "@/i18n/config";
import { fmt, placeLabel, type Dict } from "@/i18n/dictionaries";
import { getI18n, getLang } from "@/i18n/server";

const TITLE = {
  es: "Taxi en CDMX las 24 horas · Pide en línea",
  en: "Mexico City Taxi 24/7 · Book Online",
} as const;

export async function generateMetadata() {
  const lang = await getLang();
  return {
    ...pageMetadata(lang, "/", TITLE[lang], siteDescription(lang)),
    // Keep the full brand title on the home page instead of the template.
    title: { absolute: `${TITLE[lang]} | ${SITE.name}` },
  };
}

const ICONS = {
  fast: "M13 2 3 14h9l-1 8 10-12h-9l1-8Z",
  verified: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z M9 12l2 2 4-4",
  price: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  live: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};

const COPY = {
  es: {
    heroEyebrow: "Pide tu taxi ahora",
    heroLine: "taxi.org.mx · 24/7 en toda la CDMX",
    kicker: "Los mejores de la ciudad",
    h1a: "Taxi seguro en la",
    h1b: "Ciudad de México",
    lead: "Pide un taxi en línea en cualquiera de las 16 alcaldías. Ves la tarifa cerrada antes de confirmar, tu conductor está acreditado ante la SEMOVI y el servicio funciona las 24 horas, también al aeropuerto y a las centrales de autobuses.",
    seeFares: "Ver tarifas",
    coverage: "Cobertura",
    promises: ["Tarifa cerrada", "Conductores SEMOVI", "Servicio 24/7"],
    popularA: "Viajes",
    popularB: "populares",
    rosaTier: "Categoría Rosa",
    moreRoutes: "Ver más rutas y tarifas →",
    faresSmall: "Nuestras",
    faresBig: "Tarifas",
    perKmMeta: "Banderazo {base} · {seats} plazas · llega en {eta} min",
    bookNow: "Pedir ahora",
    perMinute: "Más {min}–{max} por minuto según la categoría.",
    howCalculated: "Cómo se calcula",
    whyEyebrow: "Por qué elegirnos",
    whyA: "Viaja tranquilo",
    whyB: "por la ciudad",
    whyBody: "TAXI-MEX nació para que pedir un taxi en la CDMX sea simple, seguro y con un precio que se sepa de antemano.",
    stats: ["Alcaldías", "Servicio", "Categorías"],
    features: [
      { icon: ICONS.fast, title: "Pide en segundos", body: "Elige origen y destino y ve el precio de las cuatro categorías al instante." },
      { icon: ICONS.verified, title: "Conductores verificados", body: "Acreditados ante la SEMOVI, con revisión de licencia, tarjetón y antecedentes." },
      { icon: ICONS.price, title: "Tarifa cerrada", body: "El precio que ves antes de subir es el que pagas. Sin tarifa dinámica." },
      { icon: ICONS.live, title: "Viaje en tiempo real", body: "Sigue al conductor en el mapa y comparte tu trayecto con quien elijas." },
    ],
    coverageSmall: "Cobertura",
    taxiIn: "Taxi en {place}",
    mailKicker: "¿Tienes dudas? Escríbenos",
    mailButton: "Enviar correo",
  },
  en: {
    heroEyebrow: "Book your taxi now",
    heroLine: "taxi.org.mx · 24/7 across Mexico City",
    kicker: "The best in the city",
    h1a: "Safe taxis in",
    h1b: "Mexico City",
    lead: "Book a taxi online in any of the city's 16 boroughs. You see a fixed fare before you confirm, your driver is licensed by SEMOVI, the city's transport authority, and we run 24/7, including to the airport and the bus terminals.",
    seeFares: "See fares",
    coverage: "Coverage",
    promises: ["Fixed fare", "SEMOVI-licensed drivers", "24/7 service"],
    popularA: "Popular",
    popularB: "trips",
    rosaTier: "Rosa ride",
    moreRoutes: "More routes and fares →",
    faresSmall: "Our",
    faresBig: "Fares",
    perKmMeta: "Base fare {base} · {seats} seats · pickup in {eta} min",
    bookNow: "Book now",
    perMinute: "Plus {min}–{max} per minute depending on ride type.",
    howCalculated: "How it's calculated",
    whyEyebrow: "Why choose us",
    whyA: "Ride easy",
    whyB: "around the city",
    whyBody: "TAXI-MEX was created to make getting a taxi in Mexico City simple, safe and priced up front.",
    stats: ["Boroughs", "Service", "Ride types"],
    features: [
      { icon: ICONS.fast, title: "Book in seconds", body: "Pick your pickup and drop-off and see the price of all four ride types instantly." },
      { icon: ICONS.verified, title: "Verified drivers", body: "Licensed by SEMOVI, with license, permit and background checks." },
      { icon: ICONS.price, title: "Fixed fare", body: "The price you see before you ride is the price you pay. No surge pricing." },
      { icon: ICONS.live, title: "Live trip tracking", body: "Follow your driver on the map and share your trip with anyone you choose." },
    ],
    coverageSmall: "Coverage",
    taxiIn: "Taxi in {place}",
    mailKicker: "Questions? Email us",
    mailButton: "Send an email",
  },
} satisfies Record<Lang, unknown>;

type Copy = (typeof COPY)[Lang];

/** Common trips, priced in Rosa with the same formula the booking card uses. */
const POPULAR_TRIPS: [from: string, to: string][] = [
  ["Ángel de la Independencia", "Aeropuerto AICM T1"],
  ["Polanco", "Santa Fe"],
  ["Zócalo", "Coyoacán Centro"],
  ["Terminal Norte", "Bosque de Chapultepec"],
];

const STAT_VALUES = ["16", "24/7", "4"];

export default async function Home() {
  const { lang, dict } = await getI18n();
  const c = COPY[lang];
  const cities = citiesIn(lang);
  const path = (p: string) => localePath(lang, p);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": cities.map((city) =>
            taxiServiceJsonLd(city, lang, `/taxi/${city.slug}`, city.intro),
          ),
        }}
      />

      <div className="relative">
        <SiteHeader floating />

        {/* Hero: taxi parked over the yellow band. */}
        <section className="hero-lines bg-coal px-5 pt-28 text-center sm:pt-36">
          <p className="eyebrow justify-center text-sm sm:text-lg">{c.heroEyebrow}</p>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.3em] text-snow/60">
            {c.heroLine}
          </p>
          {/* Full-bleed wrapper: the yellow band starts behind the wheels,
              so the car sits on the band below. */}
          <div className="relative -mx-5 mt-8 px-5 sm:mt-10">
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[30%] bg-taxi" />
            <TaxiIllustration className="relative mx-auto w-full max-w-3xl" />
          </div>
        </section>
      </div>

      {/* Yellow band: pitch on the left, the live booking card on the right. */}
      <section id="pedir" className="scroll-mt-4 bg-taxi px-5 pb-16 pt-10 text-coal sm:pt-14">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-10 lg:grid-cols-[1fr_440px]">
          {/* min-w-0: lets the grid column shrink, so long trip names truncate
              instead of widening the page on phones. */}
          <div className="min-w-0 lg:pt-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em]">
              {c.kicker}
            </p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[1.02] sm:text-5xl">
              {c.h1a} <br className="hidden sm:block" />
              {c.h1b}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-coal/80 sm:text-base">
              {c.lead}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#tarifas"
                className="rounded-md bg-coal px-7 py-3.5 font-display text-xs font-extrabold uppercase tracking-widest text-snow transition hover:bg-coal/85"
              >
                {c.seeFares}
              </Link>
              <Link
                href={path("/taxi")}
                className="rounded-md border-2 border-coal px-7 py-3 font-display text-xs font-extrabold uppercase tracking-widest transition hover:bg-coal hover:text-snow"
              >
                {c.coverage}
              </Link>
            </div>

            <ul className="mt-9 grid gap-3 sm:grid-cols-3">
              {c.promises.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm font-semibold">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-coal text-taxi">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <PopularTrips c={c} dict={dict} lang={lang} />
          </div>

          <RideBooker />
        </div>
      </section>

      <Tariffs c={c} dict={dict} lang={lang} />
      <Features c={c} />
      <Coverage c={c} lang={lang} />
      <CallBand c={c} />
      <SiteFooter />
    </>
  );
}

type SectionProps = { c: Copy; dict: Dict; lang: Lang };

function PopularTrips({ c, dict, lang }: SectionProps) {
  return (
    <div className="mt-10 rounded-lg bg-coal p-5 text-snow sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-base font-black uppercase">
          {c.popularA} <span className="text-taxi">{c.popularB}</span>
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-snow/50">
          {c.rosaTier}
        </span>
      </div>
      <ul className="mt-4 divide-y divide-snow/10">
        {POPULAR_TRIPS.map(([from, to]) => {
          const { km, min, fare } = rosaFare(from, to);
          return (
            <li key={`${from}-${to}`} className="flex items-center gap-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {placeLabel(dict, from)} <span className="text-taxi">→</span>{" "}
                  {placeLabel(dict, to)}
                </span>
                <span className="text-xs text-snow/50">
                  {km.toFixed(1)} km · {min} min
                </span>
              </span>
              <span className="font-display text-lg font-black tabular-nums text-taxi">
                {mxn(fare)}
              </span>
            </li>
          );
        })}
      </ul>
      <Link
        href={localePath(lang, "/tarifas")}
        className="mt-3 inline-block text-xs font-bold uppercase tracking-widest text-snow/70 transition hover:text-taxi"
      >
        {c.moreRoutes}
      </Link>
    </div>
  );
}

function SectionTitle({ small, big }: { small: string; big: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
        {small}
      </p>
      <h2 className="font-display text-4xl font-black uppercase">{big}</h2>
    </div>
  );
}

function Tariffs({ c, dict, lang }: SectionProps) {
  return (
    <section id="tarifas" className="theme-light scroll-mt-4 px-5 py-20">
      <div className="mx-auto w-full max-w-6xl">
        <SectionTitle small={c.faresSmall} big={c.faresBig} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <li
              key={t.id}
              className="card-shadow flex flex-col items-center rounded-lg bg-ink px-6 pb-7 pt-8 text-center"
            >
              <span className="grid size-16 place-items-center rounded-full bg-taxi">
                <CarIcon size={34} />
              </span>
              <h3 className="mt-5 font-display text-lg font-black uppercase">
                Taxi {t.name}
              </h3>
              <p className="mt-1 text-xs text-muted">{dict.tiers[t.id]}</p>
              <p className="mt-5 font-display text-3xl font-black text-accent">
                {mxnRate(t.perKm)}
                <span className="text-base font-extrabold">/km</span>
              </p>
              <p className="mt-2 text-xs text-muted">
                {fmt(c.perKmMeta, { base: mxn(t.base), seats: t.seats, eta: t.eta })}
              </p>
              <Link
                href="#pedir"
                className="mt-6 rounded-md bg-taxi px-6 py-2.5 font-display text-xs font-extrabold uppercase tracking-widest text-coal transition hover:bg-taxi-bright"
              >
                {c.bookNow}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-muted">
          {fmt(c.perMinute, {
            min: mxnRate(TIERS[0].perMin),
            max: mxnRate(TIERS[TIERS.length - 1].perMin),
          })}{" "}
          <Link href={localePath(lang, "/tarifas")} className="font-bold text-cream underline">
            {c.howCalculated}
          </Link>
        </p>
      </div>
    </section>
  );
}

function Features({ c }: { c: Copy }) {
  return (
    <section className="hero-lines bg-coal px-5 py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{c.whyEyebrow}</p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[1.02] text-snow">
            {c.whyA}
            <br />
            {c.whyB}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            {c.whyBody}
          </p>
          <dl className="mt-8 flex gap-10">
            {c.stats.map((label, i) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-4xl font-black text-taxi">{STAT_VALUES[i]}</dd>
                <dd className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid gap-8 sm:grid-cols-2">
          {c.features.map((f) => (
            <li key={f.title} className="flex gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-taxi text-coal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={f.icon} />
                </svg>
              </span>
              <div>
                <h3 className="font-display text-sm font-extrabold uppercase text-taxi">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Links to every zone page: useful for riders, and internal links for SEO. */
function Coverage({ c, lang }: { c: Copy; lang: Lang }) {
  return (
    <section className="theme-light px-5 py-20">
      <div className="mx-auto w-full max-w-6xl">
        {citiesIn(lang).map((city) => (
          <div key={city.slug}>
            <SectionTitle small={c.coverageSmall} big={fmt(c.taxiIn, { place: city.shortName })} />
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted">
              {city.intro}
            </p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {city.zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={localePath(lang, `/taxi/${city.slug}/${z.slug}`)}
                    className="flex h-full items-center gap-3 rounded-lg border border-ink-line bg-ink px-4 py-3.5 transition hover:border-taxi hover:bg-ink-soft"
                  >
                    <span aria-hidden className="block size-2 shrink-0 rounded-full bg-taxi" />
                    <span className="font-display text-xs font-extrabold uppercase">
                      {fmt(c.taxiIn, { place: z.name })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function CallBand({ c }: { c: Copy }) {
  return (
    <section className="bg-taxi px-5 py-12 text-coal">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em]">
            {c.mailKicker}
          </p>
          <p className="mt-1 break-all font-display text-3xl font-black sm:text-4xl">
            {SITE.email}
          </p>
        </div>
        <a
          href={`mailto:${SITE.email}`}
          className="rounded-md bg-coal px-8 py-4 font-display text-xs font-extrabold uppercase tracking-widest text-snow transition hover:bg-coal/85"
        >
          {c.mailButton}
        </a>
      </div>
    </section>
  );
}
