import PageShell from "@/components/PageShell";
import { OrderCta } from "@/components/Landing";
import { getLang } from "@/i18n/server";

const COPY = {
  es: {
    eyebrow: "Error 404",
    title: "Página no encontrada",
    lead: "La página que buscas no existe o cambió de dirección.",
    cta: "¿Necesitas un taxi?",
  },
  en: {
    eyebrow: "Error 404",
    title: "Page not found",
    lead: "The page you're looking for doesn't exist or has moved.",
    cta: "Need a taxi?",
  },
} as const;

export default async function NotFound() {
  const c = COPY[await getLang()];
  return (
    <PageShell eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
      <OrderCta title={c.cta} />
    </PageShell>
  );
}
