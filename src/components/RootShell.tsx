import type { Viewport } from "next";
import { Montserrat, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import ContactClickTracker from "./ContactClickTracker";
import "@/app/globals.css";

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
