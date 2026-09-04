/**
 * Font configuration — Next.js downloads and self-hosts these at build time,
 * so no third-party font request is made at runtime (Req 14.4).
 *
 * The returned `variable` CSS custom properties are applied to <html> in
 * layout.tsx and consumed by the Tailwind --font-display / --font-body tokens.
 */
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";

/**
 * Display font: Space Grotesk — used only for the hero name (700) and section
 * headings (600). Loading just the two weights the UI actually uses keeps the
 * critical-path font payload small, so the LCP <h1> font arrives sooner
 * (Req 14.1). Weights 400/500 were never referenced and are dropped.
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
  preload: true,
});

/**
 * Body font: Source Sans 3 — 400 (body), 500 (font-medium), 600 (font-semibold).
 * No 700 (font-bold) is used anywhere, so it is dropped; 500 is added because
 * font-medium is used and was previously synthesised rather than loaded.
 */
export const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-source-sans",
  preload: true,
});
