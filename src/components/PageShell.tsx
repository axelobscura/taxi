import Link from "next/link";
import Logo from "./Logo";
import SiteHeader from "./SiteHeader";
import { Breadcrumbs, type Crumb } from "./Landing";
import { FOOTER_NAV } from "@/lib/nav";
import { CITIES } from "@/lib/cities";
import { SITE } from "@/lib/site";

/** Standard layout for the public content pages. */
export default function PageShell({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  crumbs?: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="hero-lines relative overflow-hidden bg-coal px-5 py-14 sm:py-20">
        <div className="relative mx-auto w-full max-w-4xl">
          {crumbs && <Breadcrumbs crumbs={crumbs} />}
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="font-display text-4xl font-black uppercase leading-[0.95] text-snow sm:text-5xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-snow/70 sm:text-base">
              {lead}
            </p>
          )}
        </div>
      </section>

      {/* A yellow rule between the dark title band and the white body. */}
      <div aria-hidden className="h-1.5 bg-taxi" />

      <main className="theme-light flex-1 px-5 py-14">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-coal px-5 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Taxis verificados en la Ciudad de México. Tarifa cerrada antes de
            subir, sin sorpresas.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-3">Navegación</p>
          <ul className="space-y-1.5 text-sm">
            {FOOTER_NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted transition hover:text-accent">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {CITIES.map((city) => (
          <div key={city.slug}>
            <p className="eyebrow mb-3">Taxi en {city.shortName}</p>
            <ul className="space-y-1.5 text-sm">
              {city.zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={`/taxi/${city.slug}/${z.slug}`}
                    className="text-muted transition hover:text-accent"
                  >
                    {z.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow mb-3">Contacto</p>
          <ul className="space-y-1.5 text-sm text-muted">
            <li>
              <a href={`tel:${SITE.phone}`} className="transition hover:text-accent">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="transition hover:text-accent">
                {SITE.email}
              </a>
            </li>
            <li className="pt-1 text-xs">Servicio 24/7 en toda la CDMX</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-6xl border-t border-ink-line pt-5 text-[11px] text-muted">
        © {new Date().getFullYear()} TAXI-MEX CDMX · Conductores verificados con la
        SEMOVI
      </div>
    </footer>
  );
}
