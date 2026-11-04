import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import { SITE } from "@/lib/site";

export { viewport } from "@/components/RootShell";

/** Operator panel: Spanish only and kept out of search results. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  robots: { index: false, follow: false },
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="es-MX">{children}</RootShell>;
}
