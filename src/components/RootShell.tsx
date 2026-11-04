import type { Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import ContactClickTracker from "./ContactClickTracker";
import "@/app/globals.css";

/*
 * Self-hosted (latin, variable weight) rather than `next/font/google`: the
 * Google loader fetches fonts at build time, and on the production host
 * Google served Outfit from an extensionless URL the loader can't parse,
 * failing the build. Local files also mean builds need no network.
 * Both fonts are SIL Open Font License.
 */
const montserrat = localFont({
  src: "../fonts/montserrat-latin.woff2",
  variable: "--font-display",
  weight: "600 900",
  display: "swap",
});

const outfit = localFont({
  src: "../fonts/outfit-latin.woff2",
  variable: "--font-sans",
  weight: "300 700",
  display: "swap",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const viewport: Viewport = {
  themeColor: "#0f0f10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/**
 * `<html>` and `<body>` shared by the app's two root layouts: the public
 * site under `app/[lang]` and the operator panel under `app/(ops)`.
 */
export default function RootShell({
  lang,
  children,
}: {
  /** BCP 47 tag for `<html lang>`. */
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      className={`${montserrat.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-cream">
        {children}
        {GA_ID && <ContactClickTracker />}
      </body>
      {GA_ID && (
        <GoogleAnalytics
          gaId={GA_ID}
          debugMode={process.env.NEXT_PUBLIC_GA_DEBUG === "true"}
        />
      )}
    </html>
  );
}
