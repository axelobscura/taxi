import PageShell from "@/components/PageShell";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contacto · TAXI_MEX",
  description:
    "Escríbenos o llámanos. Atención 24/7 para viajes, facturación y altas de conductores en la CDMX.",
};

const CHANNELS = [
  {
    label: "Teléfono",
    value: "55 0011-52256",
    href: "tel:+525500115225",
    note: "24 horas, todos los días",
  },
  {
    label: "Correo",
    value: "hola@taxi.org.mx",
    href: "mailto:hola@taxi.org.mx",
    note: "Respuesta en menos de 24 h",
  },
  {
    label: "Facturación",
    value: "facturas@taxi.org.mx",
    href: "mailto:facturas@taxi.org.mx",
    note: "Lunes a viernes, 9:00–18:00",
  },
];

export default function ContactoPage() {
  return (
    <PageShell
      eyebrow="Estamos para ayudarte"
      title={<>Hablemos</>}
      lead="¿Dudas sobre un viaje, una factura o quieres unirte como conductor? Escríbenos y te respondemos rápido."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="font-display text-2xl font-extrabold uppercase">
            Envíanos un mensaje
          </h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </section>

        <aside className="space-y-3">
          <h2 className="font-display text-2xl font-extrabold uppercase">
            Otros canales
          </h2>

          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="cut-tr block border-l-2 border-rosa bg-ink-soft p-4 transition hover:bg-ink-raised"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rosa">
                {c.label}
              </p>
              <p className="font-display text-base font-extrabold">{c.value}</p>
              <p className="mt-0.5 text-xs text-muted">{c.note}</p>
            </a>
          ))}

          <div className="cut-tr bg-ink-soft p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rosa">
              Cobertura
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Las 16 alcaldías de la Ciudad de México, con servicio permanente
              al AICM (T1 y T2), Terminal Norte, TAPO y Central del Sur.
            </p>
          </div>

          <div className="cut-tr bg-ink-soft p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rosa">
              Emergencias
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Si estás en una situación de riesgo durante un viaje, marca al{" "}
              <a href="tel:911" className="font-bold text-cream underline">
                911
              </a>{" "}
              y luego repórtalo con nosotros.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
