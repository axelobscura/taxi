import type { Metadata, Viewport } from "next";
import { Montserrat, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import ContactClickTracker from "@/components/ContactClickTracker";
import { ORG_ID, SITE, absoluteUrl, jsonLd } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: {
    default: "Taxi en CDMX las 24 horas · Pide en línea | TAXI_MEX",
    template: "%s | TAXI_MEX",
  },
  description: SITE.description,
  // No canonical here: it would be inherited by every page that doesn't set
  // its own. Pages set theirs through `pageMetadata`.
  openGraph: { type: "website", locale: SITE.locale, siteName: SITE.name },
  twitter: { card: "summary_large_image" },
  // Set in the deployment env once the site is added to Search Console.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

/** Site-wide structured data: who we are and what the site is. */
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE.name,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/logo.svg"),
      email: SITE.email,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        contactType: "customer service",
        areaServed: "MX",
        availableLanguage: "es",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          opens: "00:00",
          closes: "23:59",
        },
      },
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: absoluteUrl("/"),
      name: SITE.name,
      inLanguage: "es-MX",
      publisher: { "@id": ORG_ID },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0f0f10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${montserrat.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-cream">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(SITE_JSON_LD) }}
        />
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
