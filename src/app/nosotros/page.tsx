import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Nosotros · TAXI_MEX",
  description:
    "Quiénes somos: taxis verificados en la Ciudad de México, conductores acreditados ante la SEMOVI y viajes 24/7.",
};

const VALUES = [
  {
    n: "01",
    title: "Conductores verificados",
    body: "Cada persona al volante pasa por revisión de licencia, tarjetón y antecedentes antes de recibir su primer viaje.",
  },
  {
    n: "02",
    title: "Tarifa cerrada",
    body: "El precio se calcula antes de subir y no cambia por tráfico. Sin tarifa dinámica en horas pico.",
  },
  {
    n: "03",
    title: "Viaje acompañado",
    body: "Comparte tu trayecto en tiempo real y contacta al conductor desde la app sin dar tu número.",
  },
  {
    n: "04",
    title: "Cobertura real",
    body: "Operamos en las 16 alcaldías, con servicio permanente al AICM y las centrales de autobuses.",
  },
];

const STATS = [
  { value: "16", label: "Alcaldías" },
  { value: "24/7", label: "Servicio" },
  { value: "4", label: "Categorías" },
  { value: "4.9", label: "Calificación" },
];

export default function NosotrosPage() {
  return (
    <PageShell
      eyebrow="Sobre nosotros"
      title={<>Movemos a la<br />Ciudad de México</>}
      lead="TAXI_MEX nació para que pedir un taxi en la CDMX sea simple, seguro y con un precio que se sepa de antemano."
    >
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="cut-tr border-l-2 border-rosa bg-ink-soft p-4">
            <p className="font-display text-3xl font-extrabold text-rosa">
              {s.value}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          En qué creemos
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {VALUES.map((v) => (
            <article key={v.n} className="cut-tr bg-ink-soft p-5">
              <span className="font-display text-[11px] font-bold text-rosa">
                {v.n}
              </span>
              <h3 className="mt-1 font-display text-lg font-extrabold uppercase">
                {v.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 border-l-2 border-rosa bg-ink-soft p-6">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Seguridad primero
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Todos los conductores están acreditados ante la Secretaría de
          Movilidad de la Ciudad de México (SEMOVI). Antes de subir puedes
          confirmar el nombre, la foto, el modelo del auto y la placa; si algo
          no coincide, cancela sin costo.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Durante el viaje puedes compartir tu ubicación en tiempo real con
          quien elijas, y el número del conductor queda enmascarado en las
          llamadas.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          ¿Manejas un taxi?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Si tienes tu tarjetón vigente y quieres recibir viajes con nosotros,
          los operadores dan de alta conductores desde el panel de flota.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contacto"
            className="skewed-btn glow-rosa bg-rosa px-8 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-white transition active:scale-[0.98]"
          >
            <span className="block">Contáctanos</span>
          </Link>
          <Link
            href="/entrar"
            className="border-2 border-ink-line px-6 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-muted transition hover:border-rosa hover:text-rosa"
          >
            Panel de flota
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
