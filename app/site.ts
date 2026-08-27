import { Fraunces, Fustat } from "next/font/google";

/**
 * Shared by both root layouts. There are two — one per URL shape — so the
 * fonts and the site constants have to live outside either of them:
 *
 *   app/[locale]/layout.tsx   the real site, <html lang> per locale
 *   app/(redirect)/layout.tsx the bare "/" locale chooser
 *
 * Creating a next/font instance twice would emit two copies of the CSS, so
 * both layouts import these.
 */

// Fustat carries body copy and UI — rounded, geometric, unfussy.
export const sans = Fustat({ subsets: ["latin"], variable: "--font-sans" });

// Fraunces carries every headline and the wordmark. Its soft, slightly wonky
// serif is what keeps the site warm instead of corporate; `SOFT` rounds the
// terminals and `WONK` lets the italic-ish forms breathe, which reads as
// hand-made rather than tropical-clipart.
// Both are fetched at build time; the build environment must reach
// fonts.googleapis.com.
export const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
});

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fischertropitel.com";

/** Applied to <html> by both root layouts. */
export const htmlClass = `${sans.variable} ${display.variable} scroll-smooth`;
