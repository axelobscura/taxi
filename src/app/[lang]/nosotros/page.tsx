import Link from "next/link";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/site";
import { LOGIN_PATH } from "@/lib/nav";
import { localePath, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";

const STAT_VALUES = ["16", "24/7", "4", "4.9"];

const COPY = {
  es: {
    title: "Nosotros: taxis verificados en la Ciudad de México",
    description:
      "Quiénes somos: taxis verificados en la Ciudad de México, conductores acreditados ante la SEMOVI y viajes 24/7.",
    eyebrow: "Sobre nosotros",
    h1a: "Movemos a la",
    h1b: "Ciudad de México",
    lead: "TAXI-MEX nació para que pedir un taxi en la CDMX sea simple, seguro y con un precio que se sepa de antemano.",
    stats: ["Alcaldías", "Servicio", "Categorías", "Calificación"],
    valuesTitle: "En qué creemos",
    values: [
      { title: "Conductores verificados", body: "Cada persona al volante pasa por revisión de licencia, tarjetón y antecedentes antes de recibir su primer viaje." },
      { title: "Tarifa cerrada", body: "El precio se calcula antes de subir y no cambia por tráfico. Sin tarifa dinámica en horas pico." },
      { title: "Viaje acompañado", body: "Comparte tu trayecto en tiempo real y contacta al conductor desde la app sin dar tu número." },
      { title: "Cobertura real", body: "Operamos en las 16 alcaldías, con servicio permanente al AICM y las centrales de autobuses." },
    ],
    safetyTitle: "Seguridad primero",
    safety: [
      "Todos los conductores están acreditados ante la Secretaría de Movilidad de la Ciudad de México (SEMOVI). Antes de subir puedes confirmar el nombre, la foto, el modelo del auto y la placa; si algo no coincide, cancela sin costo.",
      "Durante el viaje puedes compartir tu ubicación en tiempo real con quien elijas, y el número del conductor queda enmascarado en las llamadas.",
    ],
    driveTitle: "¿Manejas un taxi?",
    driveBody: "Si tienes tu tarjetón vigente y quieres recibir viajes con nosotros, los operadores dan de alta conductores desde el panel de flota.",
    contact: "Contáctanos",
    fleet: "Panel de flota",
  },
  en: {
    title: "About Us: Verified Taxis in Mexico City",
    description:
      "Who we are: verified taxis in Mexico City, drivers licensed by SEMOVI and rides 24/7.",
    eyebrow: "About us",
    h1a: "Moving",
    h1b: "Mexico City",
    lead: "TAXI-MEX was created to make getting a taxi in Mexico City simple, safe and priced up front.",
    stats: ["Boroughs", "Service", "Ride types", "Rating"],
    valuesTitle: "What we believe in",
    values: [
      { title: "Verified drivers", body: "Everyone behind the wheel passes license, permit and background checks before their first ride." },
      { title: "Fixed fare", body: "The price is set before you ride and doesn't change with traffic. No rush-hour surge pricing." },
      { title: "You're never alone", body: "Share your trip live and contact your driver through the app without giving out your number." },
      { title: "Real coverage", body: "We operate in all 16 boroughs, with round-the-clock service to AICM airport and the bus terminals." },
    ],
    safetyTitle: "Safety first",
    safety: [
      "Every driver is licensed by Mexico City's transport authority (SEMOVI). Before you get in you can check the name, photo, car model and plate; if anything doesn't match, cancel for free.",
      "During the trip you can share your live location with anyone you choose, and the driver's number is masked on calls.",
    ],
    driveTitle: "Do you drive a taxi?",
    driveBody: "If you have a valid taxi permit and want to take rides with us, our operators register drivers from the fleet panel.",
    contact: "Contact us",
    fleet: "Fleet panel",
  },
} satisfies Record<Lang, unknown>;

export async function generateMetadata() {
  const lang = await getLang();
  return pageMetadata(lang, "/nosotros", COPY[lang].title, COPY[lang].description);
}

export default async function NosotrosPage() {
  const lang = await getLang();
  const c = COPY[lang];
  return (
    <PageShell
      eyebrow={c.eyebrow}
      title={<>{c.h1a}<br />{c.h1b}</>}
      lead={c.lead}
    >
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {c.stats.map((label, i) => (
          <div key={label} className="border-l-2 border-taxi bg-ink-soft p-4">
            <p className="font-display text-3xl font-extrabold text-accent">
              {STAT_VALUES[i]}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
              {label}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.valuesTitle}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {c.values.map((v, i) => (
            <article key={v.title} className="bg-ink-soft p-5">
              <span className="font-display text-[11px] font-bold text-accent">
                {`0${i + 1}`}
              </span>
              <h3 className="mt-1 font-display text-lg font-extrabold uppercase">
                {v.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 border-l-2 border-taxi bg-ink-soft p-6">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.safetyTitle}
        </h2>
        {c.safety.map((p) => (
          <p key={p} className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {p}
          </p>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.driveTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {c.driveBody}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={localePath(lang, "/contacto")}
            className="bg-taxi px-8 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-coal transition active:scale-[0.98]"
          >
            <span className="block">{c.contact}</span>
          </Link>
          <Link
            href={LOGIN_PATH}
            className="border-2 border-ink-line px-6 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-muted transition hover:border-taxi hover:text-accent"
          >
            {c.fleet}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
