import PageShell from "@/components/PageShell";
import ContactForm from "./ContactForm";
import { SITE, pageMetadata } from "@/lib/site";
import type { Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";

const BILLING_EMAIL = "facturas@taxi.org.mx";

const COPY = {
  es: {
    title: "Contacto: atención 24/7 y facturación",
    description:
      "Escríbenos por correo o desde el formulario. Atención 24/7 para viajes, facturación y altas de conductores en la CDMX.",
    eyebrow: "Estamos para ayudarte",
    h1: "Hablemos",
    lead: "¿Dudas sobre un viaje, una factura o quieres unirte como conductor? Escríbenos y te respondemos rápido.",
    formTitle: "Envíanos un mensaje",
    channelsTitle: "Otros canales",
    channels: [
      { label: "Correo", email: SITE.email, note: "Respuesta en menos de 24 h" },
      { label: "Facturación", email: BILLING_EMAIL, note: "Lunes a viernes, 9:00–18:00" },
    ],
    coverageTitle: "Cobertura",
    coverage:
      "Las 16 alcaldías de la Ciudad de México, con servicio permanente al AICM (T1 y T2), Terminal Norte, TAPO y Central del Sur.",
    emergencyTitle: "Emergencias",
    emergencyA: "Si estás en una situación de riesgo durante un viaje, marca al",
    emergencyB: "y luego repórtalo con nosotros.",
  },
  en: {
    title: "Contact: 24/7 Support and Invoicing",
    description:
      "Email us or use the form. 24/7 support for trips, invoicing and driver sign-ups in Mexico City.",
    eyebrow: "We're here to help",
    h1: "Let's talk",
    lead: "Questions about a trip or an invoice, or want to join as a driver? Write to us and we'll get back to you fast.",
    formTitle: "Send us a message",
    channelsTitle: "Other channels",
    channels: [
      { label: "Email", email: SITE.email, note: "Reply within 24 hours" },
      { label: "Invoicing", email: BILLING_EMAIL, note: "Monday to Friday, 9:00–18:00" },
    ],
    coverageTitle: "Coverage",
    coverage:
      "All 16 boroughs of Mexico City, with round-the-clock service to AICM airport (T1 and T2) and the North, TAPO and South bus terminals.",
    emergencyTitle: "Emergencies",
    emergencyA: "If you're in danger during a trip, call",
    emergencyB: "and then report it to us.",
  },
} satisfies Record<Lang, unknown>;

export async function generateMetadata() {
  const lang = await getLang();
  return pageMetadata(lang, "/contacto", COPY[lang].title, COPY[lang].description);
}

export default async function ContactoPage() {
  const lang = await getLang();
  const c = COPY[lang];
  return (
    <PageShell eyebrow={c.eyebrow} title={<>{c.h1}</>} lead={c.lead}>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="font-display text-2xl font-extrabold uppercase">
            {c.formTitle}
          </h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </section>

        <aside className="space-y-3">
          <h2 className="font-display text-2xl font-extrabold uppercase">
            {c.channelsTitle}
          </h2>

          {c.channels.map((ch) => (
            <a
              key={ch.label}
              href={`mailto:${ch.email}`}
              className="block border-l-2 border-taxi bg-ink-soft p-4 transition hover:bg-ink-raised"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                {ch.label}
              </p>
              <p className="font-display text-base font-extrabold">{ch.email}</p>
              <p className="mt-0.5 text-xs text-muted">{ch.note}</p>
            </a>
          ))}

          <div className="bg-ink-soft p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
              {c.coverageTitle}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {c.coverage}
            </p>
          </div>

          <div className="bg-ink-soft p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
              {c.emergencyTitle}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {c.emergencyA}{" "}
              <a href="tel:911" className="font-bold text-cream underline">
                911
              </a>{" "}
              {c.emergencyB}
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
