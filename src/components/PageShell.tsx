import Link from "next/link";
import SiteHeader from "./SiteHeader";
import { FOOTER_NAV } from "@/lib/nav";

/** Standard layout for the public content pages. */
export default function PageShell({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="border-b border-ink-line bg-ink-soft px-5 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-4xl">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {lead}
            </p>
          )}
        </div>
      </section>

      <main className="flex-1 px-5 py-12">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-ink-line bg-ink-soft px-5 py-10">
      <div className="mx-auto grid w-full max-w-4xl gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-extrabold">TAXI_MEX</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Taxis verificados en la Ciudad de México. Tarifa cerrada antes de
            subir, sin sorpresas.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-3">Navegación</p>
          <ul className="space-y-1.5 text-sm">
            {FOOTER_NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted transition hover:text-rosa">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Contacto</p>
          <ul className="space-y-1.5 text-sm text-muted">
            <li>55 0011-52256</li>
            <li>hola@taxi.org.mx</li>
            <li className="pt-1 text-xs">Servicio 24/7 en toda la CDMX</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-4xl border-t border-ink-line pt-5 text-[11px] text-muted">
        © {new Date().getFullYear()} TAXI_MEX CDMX · Conductores verificados con la
        SEMOVI
      </div>
    </footer>
  );
}
