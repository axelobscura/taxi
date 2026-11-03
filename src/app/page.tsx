import Link from "next/link";
import RideBooker from "./RideBooker";
import SiteHeader from "@/components/SiteHeader";
import TaxiIllustration from "@/components/TaxiIllustration";
import { SiteFooter } from "@/components/PageShell";
import { JsonLd, taxiServiceJsonLd } from "@/components/Landing";
import { CITIES } from "@/lib/cities";
import { TIERS, mxn, mxnRate } from "@/lib/data";
import { SITE, pageMetadata } from "@/lib/site";

export const metadata = {
  ...pageMetadata(
    "/",
    "Taxi en CDMX las 24 horas · Pide en línea",
    SITE.description,
  ),
  // Keep the full brand title on the home page instead of the template.
  title: { absolute: "Taxi en CDMX las 24 horas · Pide en línea | TAXI_MEX" },
};

const FEATURES = [
  {
    title: "Pide en segundos",
    body: "Elige origen y destino y ve el precio de las cuatro categorías al instante.",
    icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8Z",
  },
  {
    title: "Conductores verificados",
    body: "Acreditados ante la SEMOVI, con revisión de licencia, tarjetón y antecedentes.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z M9 12l2 2 4-4",
  },
  {
    title: "Tarifa cerrada",
    body: "El precio que ves antes de subir es el que pagas. Sin tarifa dinámica.",
    icon: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
  {
    title: "Viaje en tiempo real",
    body: "Sigue al conductor en el mapa y comparte tu trayecto con quien elijas.",
    icon: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  },
];

const STATS = [
  { value: "16", label: "Alcaldías" },
  { value: "24/7", label: "Servicio" },
  { value: "4", label: "Categorías" },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": CITIES.map((c) =>
            taxiServiceJsonLd(c, `/taxi/${c.slug}`, c.intro),
          ),
        }}
      />

      <div className="relative">
        <SiteHeader floating />

        {/* Hero: phone number up front, taxi parked over the yellow band. */}
        <section className="hero-lines bg-coal px-5 pt-28 text-center sm:pt-36">
          <p className="eyebrow justify-center">Pide tu taxi ahora</p>
          <a
            href={`tel:${SITE.phone}`}
            className="mt-3 inline-block font-display text-4xl font-black tracking-tight text-snow transition hover:text-taxi sm:text-7xl"
          >
            {SITE.phoneDisplay}
          </a>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.3em] text-snow/60">
            taxi.org.mx · 24/7 en toda la CDMX
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
          <div className="lg:pt-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em]">
              Los mejores de la ciudad
            </p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[1.02] sm:text-5xl">
              Taxi seguro en la <br className="hidden sm:block" />
              Ciudad de México
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-coal/80 sm:text-base">
              Pide un taxi en línea en cualquiera de las 16 alcaldías. Ves la
              tarifa cerrada antes de confirmar, tu conductor está acreditado
              ante la SEMOVI y el servicio funciona las 24 horas, también al
              aeropuerto y a las centrales de autobuses.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#tarifas"
                className="rounded-md bg-coal px-7 py-3.5 font-display text-xs font-extrabold uppercase tracking-widest text-snow transition hover:bg-coal/85"
              >
                Ver tarifas
              </Link>
              <Link
                href="/taxi"
                className="rounded-md border-2 border-coal px-7 py-3 font-display text-xs font-extrabold uppercase tracking-widest transition hover:bg-coal hover:text-snow"
              >
                Cobertura
              </Link>
            </div>
          </div>

          <RideBooker />
        </div>
      </section>

      <Tariffs />
      <Features />
      <Coverage />
      <CallBand />
      <SiteFooter />
    </>
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

function Tariffs() {
  return (
    <section id="tarifas" className="theme-light scroll-mt-4 px-5 py-20">
      <div className="mx-auto w-full max-w-6xl">
        <SectionTitle small="Nuestras" big="Tarifas" />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <li
              key={t.id}
              className="card-shadow flex flex-col items-center rounded-lg bg-ink px-6 pb-7 pt-8 text-center"
            >
              <span className="grid size-16 place-items-center rounded-full bg-taxi">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 15h16v-4l-2.6-4.1a2 2 0 0 0-1.7-.9H8.3a2 2 0 0 0-1.7.9L4 11Z" fill="#111" />
                  <circle cx="7.8" cy="16.6" r="1.9" fill="#111" />
                  <circle cx="16.2" cy="16.6" r="1.9" fill="#111" />
                </svg>
              </span>
              <h3 className="mt-5 font-display text-lg font-black uppercase">
                Taxi {t.name}
              </h3>
              <p className="mt-1 text-xs text-muted">{t.tagline}</p>
              <p className="mt-5 font-display text-3xl font-black text-accent">
                {mxnRate(t.perKm)}
                <span className="text-base font-extrabold">/km</span>
              </p>
              <p className="mt-2 text-xs text-muted">
                Banderazo {mxn(t.base)} · {t.seats} plazas · llega en {t.eta} min
              </p>
              <Link
                href="#pedir"
                className="mt-6 rounded-md bg-taxi px-6 py-2.5 font-display text-xs font-extrabold uppercase tracking-widest text-coal transition hover:bg-taxi-bright"
              >
                Pedir ahora
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-muted">
          Más {mxnRate(TIERS[0].perMin)}–{mxnRate(TIERS[TIERS.length - 1].perMin)} por
          minuto según la categoría.{" "}
          <Link href="/tarifas" className="font-bold text-cream underline">
            Cómo se calcula
          </Link>
        </p>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="hero-lines bg-coal px-5 py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Por qué elegirnos</p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[1.02] text-snow">
            Viaja tranquilo
            <br />
            por la ciudad
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            TAXI_MEX nació para que pedir un taxi en la CDMX sea simple, seguro
            y con un precio que se sepa de antemano.
          </p>
          <dl className="mt-8 flex gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl font-black text-taxi">{s.value}</dd>
                <dd className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid gap-8 sm:grid-cols-2">
          {FEATURES.map((f) => (
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
function Coverage() {
  return (
    <section className="theme-light px-5 py-20">
      <div className="mx-auto w-full max-w-6xl">
        {CITIES.map((city) => (
          <div key={city.slug}>
            <SectionTitle small="Cobertura" big={`Taxi en ${city.shortName}`} />
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted">
              {city.intro}
            </p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {city.zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={`/taxi/${city.slug}/${z.slug}`}
                    className="flex h-full items-center gap-3 rounded-lg border border-ink-line bg-ink px-4 py-3.5 transition hover:border-taxi hover:bg-ink-soft"
                  >
                    <span aria-hidden className="block size-2 shrink-0 rounded-full bg-taxi" />
                    <span className="font-display text-xs font-extrabold uppercase">
                      Taxi en {z.name}
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

function CallBand() {
  return (
    <section className="bg-taxi px-5 py-12 text-coal">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em]">
            ¿Prefieres llamar?
          </p>
          <p className="mt-1 font-display text-3xl font-black sm:text-4xl">
            {SITE.phoneDisplay}
          </p>
        </div>
        <a
          href={`tel:${SITE.phone}`}
          className="rounded-md bg-coal px-8 py-4 font-display text-xs font-extrabold uppercase tracking-widest text-snow transition hover:bg-coal/85"
        >
          Llamar ahora
        </a>
      </div>
    </section>
  );
}
