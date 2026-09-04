import type { Metadata } from "next";
import { spaceGrotesk, sourceSans } from "./fonts";
import { SkipLink } from "@/components/layout/SkipLink";
import "./globals.css";

/**
 * Req 13.1 — title and meta description derived from profile data.
 * Req 13.2 — Open Graph and Twitter card tags.
 * Req 13.5 — canonical URL set via metadataBase + alternates.
 */
export const metadata: Metadata = {
  title: "Fathi Zidan — Software, Cloud & Systems",
  description:
    "Computer Science graduate from the Hebrew University of Jerusalem with production engineering experience at Dynamic Yield (Mastercard). Skilled in cloud infrastructure, automation, and software development.",
  metadataBase: new URL("https://fathi-zidan.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "/",
    siteName: "Fathi Zidan",
    title: "Fathi Zidan — Software, Cloud & Systems",
    description:
      "Computer Science graduate with production engineering experience at Dynamic Yield (Mastercard).",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fathi Zidan — Software, Cloud & Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fathi Zidan — Software, Cloud & Systems",
    description:
      "Computer Science graduate with production engineering experience at Dynamic Yield (Mastercard).",
    images: ["/og-image.png"],
  },
};

/**
 * Pre-paint theme script — runs synchronously before React hydration so the
 * correct theme class is on <html> before any pixels are painted.
 *
 * Reads localStorage.theme, falls back to prefers-color-scheme, and adds or
 * removes the "dark" class on <html>. Wrapped in try/catch so storage errors
 * (private browsing restrictions) never crash the page.
 *
 * Satisfies Req 11.1 (system preference respected on first paint) and
 * Req 11.4 (no flash of the opposite theme).
 */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${sourceSans.variable}`}
    >
      <head>
        {/*
         * dangerouslySetInnerHTML is intentional here — this script must run
         * inline and synchronously before first paint to prevent a theme flash.
         * The content is a static string defined above; no user data is
         * interpolated into it.
         */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg text-text font-body">
        {/* SkipLink must be the very first focusable element — Req 12.3 */}
        <SkipLink />
        {/*
         * <main> here ensures #main-content always exists as the skip target,
         * regardless of which page is rendered — Req 12.4.
         */}
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
